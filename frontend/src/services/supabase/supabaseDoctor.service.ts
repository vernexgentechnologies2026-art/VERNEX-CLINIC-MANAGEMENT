import { supabase } from "../../lib/supabaseClient";
import type { ConsultationRecord, DeliveryStatus, DoctorAvailabilityRecord, PrescriptionItemRecord, PrescriptionRecord, ReminderRecord, ReminderStatus } from "../../shared/types/domain";
import type { Json, Tables, TablesInsert, TablesUpdate } from "../../shared/types/database.types";
import type { ConsultationFilters, CreatePrescriptionWithItemsInput, DoctorDomainService, PrescriptionFilters, PrescriptionWithItemsResult } from "../interfaces";
import { logAuditEvent } from "./auditLogger";
import { supabaseAuthService } from "./supabaseAuth.service";

type AvailabilityRow = Tables<"doctor_availability">;
type DoctorProfileRow = Tables<"doctor_profiles">;
type ConsultationRow = Tables<"consultations">;
type PrescriptionRow = Tables<"prescriptions">;
type PrescriptionItemRow = Tables<"prescription_items">;
type MedicineReminderRow = Tables<"medicine_reminders">;

function mapAvailability(row: AvailabilityRow): DoctorAvailabilityRecord {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    branchId: row.branch_id ?? "",
    weekday: String(row.day_of_week ?? ""),
    startTime: row.start_time,
    endTime: row.end_time,
    slotDurationMinutes: 15,
    blockedDates: [],
  };
}

function normalizeConsultationFilters(filters?: string | ConsultationFilters): ConsultationFilters {
  return typeof filters === "string" ? { patientId: filters } : filters ?? {};
}

function mapConsultation(row: ConsultationRow): ConsultationRecord {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    symptoms: row.symptoms ?? "",
    vitals: {},
    diagnosis: row.diagnosis ?? "",
    notes: row.clinical_notes ?? "",
    status: row.status === "completed" ? "completed" : "draft",
  };
}

function normalizePrescriptionFilters(filters?: string | PrescriptionFilters): PrescriptionFilters {
  return typeof filters === "string" ? { patientId: filters } : filters ?? {};
}

function mapPrescriptionStatus(row: PrescriptionRow): PrescriptionRecord["status"] {
  if (row.status === "finalized" || row.status === "completed") return "completed";
  if (row.pharmacy_status === "sent_to_pharmacy" || row.send_to_pharmacy) return "sent_to_pharmacy";
  if (row.delivery_channel === "whatsapp" && row.delivery_status && row.delivery_status !== "queued") return "sent_to_whatsapp";
  return "draft";
}

function mapPrescriptionItem(row: PrescriptionItemRow): PrescriptionItemRecord {
  return {
    id: row.id,
    prescriptionId: row.prescription_id,
    medicineId: row.medicine_id ?? row.medicine_name,
    medicineName: row.medicine_name,
    dosage: row.dosage ?? "",
    frequency: row.frequency ?? "",
    timing: row.timing ?? "",
    duration: row.duration ?? "",
    beforeAfterFood: row.food_instruction === "before_food" ? "before_food" : "after_food",
  };
}

function mapPrescription(row: PrescriptionRow, items: PrescriptionItemRow[] = []): PrescriptionRecord {
  return {
    id: row.id,
    consultationId: row.consultation_id ?? "",
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    status: mapPrescriptionStatus(row),
    deliveryStatus: (row.delivery_status ?? "queued") as DeliveryStatus,
    items: items.map(mapPrescriptionItem),
    followUpDate: row.follow_up_date ?? undefined,
  };
}

function mapReminder(row: MedicineReminderRow): ReminderRecord {
  return {
    id: row.id,
    patientId: row.patient_id,
    prescriptionItemId: row.prescription_item_id ?? undefined,
    type: "medicine",
    status: (row.status ?? "active") as ReminderStatus,
    deliveryStatus: (row.delivery_status ?? "queued") as DeliveryStatus,
    nextRunAt: row.next_run_at ?? row.created_at ?? new Date().toISOString(),
  };
}

function normalizePrescriptionRpcResult(value: Json): PrescriptionWithItemsResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Prescription RPC did not return a valid payload.");
  }
  const result = value as { prescription?: PrescriptionRow; items?: PrescriptionItemRow[] };
  if (!result.prescription) throw new Error("Prescription RPC did not return a prescription.");
  return { prescription: result.prescription, items: result.items ?? [] };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateToWeekday(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

function normalizeDateRange(dateOrRange: string | { from: string; to: string }) {
  return typeof dateOrRange === "string" ? { from: dateOrRange, to: dateOrRange } : dateOrRange;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number) {
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}:00`;
}

async function getProfile(doctorId: string): Promise<DoctorProfileRow> {
  const { data, error } = await supabase.from("doctor_profiles").select("*").eq("id", doctorId).single();
  if (error) throw error;
  return data;
}

async function updateAppointmentStatus(appointmentId: string, status: string, reason: string) {
  const { error } = await supabase.rpc("update_appointment_status", {
    appointment_id: appointmentId,
    new_status: status,
    reason,
  });
  if (error) throw error;
}

export const supabaseDoctorDomainService: DoctorDomainService = {
  async getDoctorProfiles() {
    const { data, error } = await supabase.from("doctor_profiles").select("*").eq("status", "active").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getDoctorProfileByStaffId(staffId) {
    const { data, error } = await supabase.from("doctor_profiles").select("*").eq("staff_id", staffId).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getDoctorAvailability(doctorId) {
    const { data, error } = await supabase.from("doctor_availability").select("*").eq("doctor_id", doctorId).eq("is_active", true).order("day_of_week", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapAvailability);
  },

  async updateDoctorAvailability(input) {
    if (input.length === 0) return [];
    const doctorId = input[0].doctor_id;
    const { error: deleteError } = await supabase.from("doctor_availability").delete().eq("doctor_id", doctorId);
    if (deleteError) throw deleteError;
    const { data, error } = await supabase.from("doctor_availability").insert(input).select("*");
    if (error) throw error;
    return data ?? [];
  },

  async getDoctorBlockedDates(doctorId) {
    const { data, error } = await supabase.from("doctor_blocked_dates").select("*").eq("doctor_id", doctorId).order("blocked_date", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async blockDoctorDate(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const { data, error } = await supabase.from("doctor_blocked_dates").insert({ ...input, created_by: input.created_by ?? context.staffProfileId }).select("*").single();
    if (error) throw error;
    await supabase.from("appointment_slots").update({ status: "blocked" }).eq("doctor_id", input.doctor_id).eq("slot_date", input.blocked_date);
    return data;
  },

  async getAvailableSlots(doctorId, date) {
    const { data: existingSlots, error: existingError } = await supabase.from("appointment_slots").select("*").eq("doctor_id", doctorId).eq("slot_date", date).order("start_time", { ascending: true });
    if (existingError) throw existingError;

    if ((existingSlots ?? []).length === 0) {
      await this.generateSlotsForDoctor(doctorId, date);
    }

    const { data, error } = await supabase.from("appointment_slots").select("*").eq("doctor_id", doctorId).eq("slot_date", date).eq("status", "available").order("start_time", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async generateSlotsForDoctor(doctorId, dateOrRange) {
    const dateRange = normalizeDateRange(dateOrRange);
    const profile = await getProfile(doctorId);
    const [{ data: availability, error }, { data: blockedDates, error: blockedError }] = await Promise.all([
      supabase.from("doctor_availability").select("*").eq("doctor_id", doctorId).eq("is_active", true),
      supabase.from("doctor_blocked_dates").select("blocked_date").eq("doctor_id", doctorId),
    ]);
    if (error) throw error;
    if (blockedError) throw blockedError;
    const blocked = new Set((blockedDates ?? []).map((item) => item.blocked_date));
    const rows: TablesInsert<"appointment_slots">[] = [];
    const start = new Date(`${dateRange.from}T00:00:00`);
    const end = new Date(`${dateRange.to}T00:00:00`);
    for (let day = start; day <= end; day = addDays(day, 1)) {
      const slotDate = isoDate(day);
      if (blocked.has(slotDate)) continue;
      const weekday = dateToWeekday(slotDate);
      for (const item of availability ?? []) {
        if (item.day_of_week !== weekday) continue;
        const slotDuration = profile.slot_duration_minutes ?? 15;
        let cursor = timeToMinutes(item.start_time);
        const finish = timeToMinutes(item.end_time);
        const breakStart = item.break_start ? timeToMinutes(item.break_start) : null;
        const breakEnd = item.break_end ? timeToMinutes(item.break_end) : null;
        while (cursor + slotDuration <= finish) {
          const inBreak = breakStart !== null && breakEnd !== null && cursor >= breakStart && cursor < breakEnd;
          if (!inBreak) {
            rows.push({
              clinic_id: profile.clinic_id,
              branch_id: item.branch_id ?? profile.branch_id,
              doctor_id: doctorId,
              slot_date: slotDate,
              start_time: minutesToTime(cursor),
              end_time: minutesToTime(cursor + slotDuration),
              capacity: profile.max_appointments_per_slot ?? 1,
              booked_count: 0,
              status: "available",
            });
          }
          cursor += slotDuration;
        }
      }
    }
    if (rows.length === 0) return [];
    const { error: insertError } = await supabase.from("appointment_slots").upsert(rows, { onConflict: "doctor_id,slot_date,start_time", ignoreDuplicates: true });
    if (insertError) throw insertError;
    const { data, error: selectError } = await supabase.from("appointment_slots").select("*").eq("doctor_id", doctorId).gte("slot_date", dateRange.from).lte("slot_date", dateRange.to).order("slot_date", { ascending: true }).order("start_time", { ascending: true });
    if (selectError) throw selectError;
    return data ?? [];
  },

  async getConsultations(filters) {
    const normalized = normalizeConsultationFilters(filters);
    let query = supabase.from("consultations").select("*").order("created_at", { ascending: false });
    if (normalized.clinicId) query = query.eq("clinic_id", normalized.clinicId);
    if (normalized.patientId) query = query.eq("patient_id", normalized.patientId);
    if (normalized.doctorId) query = query.eq("doctor_id", normalized.doctorId);
    if (normalized.appointmentId) query = query.eq("appointment_id", normalized.appointmentId);
    if (normalized.status) query = query.eq("status", normalized.status);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapConsultation);
  },

  async getConsultationById(id) {
    const { data, error } = await supabase.from("consultations").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async getConsultationsByPatient(patientId) {
    const { data, error } = await supabase.from("consultations").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getConsultationByAppointment(appointmentId) {
    const { data, error } = await supabase.from("consultations").select("*").eq("appointment_id", appointmentId).maybeSingle();
    if (error) throw error;
    return data;
  },

  async createConsultation(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const payload: TablesInsert<"consultations"> = {
      ...input,
      clinic_id: input.clinic_id || context.clinic_id || "",
      branch_id: input.branch_id ?? context.branch_id,
      created_by: input.created_by ?? context.staffProfileId,
      status: input.status ?? "draft",
    };
    const { data, error } = await supabase.from("consultations").insert(payload).select("*").single();
    if (error) throw error;
    await updateAppointmentStatus(data.appointment_id, "in_consultation", "consultation_started");
    return data;
  },

  async updateConsultation(id, input: TablesUpdate<"consultations">) {
    const { data, error } = await supabase.from("consultations").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },

  async completeConsultation(id) {
    const { data, error } = await supabase.from("consultations").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id).select("*").single();
    if (error) throw error;
    await updateAppointmentStatus(data.appointment_id, "completed", "consultation_completed");
    logAuditEvent({ clinicId: data.clinic_id, branchId: data.branch_id, eventType: "consultation_completed", entityType: "consultations", entityId: data.id, action: "complete", status: "success", severity: "info", message: "Consultation completed.", metadata: { appointment_id: data.appointment_id, patient_id: data.patient_id } });
    return data;
  },

  async saveVitals(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const { data, error } = await supabase.from("consultation_vitals").insert({ ...input, clinic_id: input.clinic_id || context.clinic_id || "" }).select("*").single();
    if (error) throw error;
    return data;
  },

  async getVitals(consultationId) {
    const { data, error } = await supabase.from("consultation_vitals").select("*").eq("consultation_id", consultationId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addConsultationNote(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const { data, error } = await supabase.from("consultation_notes").insert({ ...input, clinic_id: input.clinic_id || context.clinic_id || "", created_by: input.created_by ?? context.staffProfileId }).select("*").single();
    if (error) throw error;
    return data;
  },

  async getConsultationNotes(consultationId) {
    const { data, error } = await supabase.from("consultation_notes").select("*").eq("consultation_id", consultationId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getPrescriptions(filters) {
    const normalized = normalizePrescriptionFilters(filters);
    let query = supabase.from("prescriptions").select("*").order("created_at", { ascending: false });
    if (normalized.clinicId) query = query.eq("clinic_id", normalized.clinicId);
    if (normalized.patientId) query = query.eq("patient_id", normalized.patientId);
    if (normalized.consultationId) query = query.eq("consultation_id", normalized.consultationId);
    if (normalized.appointmentId) query = query.eq("appointment_id", normalized.appointmentId);
    if (normalized.doctorId) query = query.eq("doctor_id", normalized.doctorId);
    if (normalized.status) query = query.eq("status", normalized.status);
    if (normalized.deliveryStatus) query = query.eq("delivery_status", normalized.deliveryStatus);
    if (normalized.pharmacyStatus) query = query.eq("pharmacy_status", normalized.pharmacyStatus);
    const { data: rows, error } = await query;
    if (error) throw error;
    const prescriptions = rows ?? [];
    if (prescriptions.length === 0) return [];
    const { data: itemRows, error: itemsError } = await supabase.from("prescription_items").select("*").in("prescription_id", prescriptions.map((item) => item.id));
    if (itemsError) throw itemsError;
    return prescriptions.map((prescription) => mapPrescription(prescription, (itemRows ?? []).filter((item) => item.prescription_id === prescription.id)));
  },

  async getPrescriptionById(id) {
    const { data: prescription, error } = await supabase.from("prescriptions").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!prescription) return null;
    const { data: items, error: itemsError } = await supabase.from("prescription_items").select("*").eq("prescription_id", id).order("sort_order", { ascending: true });
    if (itemsError) throw itemsError;
    return { prescription, items: items ?? [] };
  },

  async getPrescriptionsByPatient(patientId) {
    return this.getPrescriptions({ patientId });
  },

  async getPrescriptionsByConsultation(consultationId) {
    return this.getPrescriptions({ consultationId });
  },

  async createPrescription(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const payload: TablesInsert<"prescriptions"> = {
      ...input,
      clinic_id: input.clinic_id || context.clinic_id || "",
      branch_id: input.branch_id ?? context.branch_id,
      created_by: input.created_by ?? context.staffProfileId,
      status: input.status ?? "draft",
      delivery_status: input.delivery_status ?? "queued",
      delivery_channel: input.delivery_channel ?? "none",
      pharmacy_status: input.pharmacy_status ?? "not_sent",
    };
    const { data, error } = await supabase.from("prescriptions").insert(payload).select("*").single();
    if (error) throw error;
    logAuditEvent({ clinicId: data.clinic_id, branchId: data.branch_id, eventType: "prescription_created", entityType: "prescriptions", entityId: data.id, action: "create", status: "success", severity: "info", message: "Prescription created.", metadata: { patient_id: data.patient_id } });
    return data;
  },

  async updatePrescription(id, input) {
    const { data, error } = await supabase.from("prescriptions").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },

  async createPrescriptionWithItems(input: CreatePrescriptionWithItemsInput) {
    const payload = {
      prescription: input.prescription,
      items: input.items,
      reminder_consent_confirmed: input.reminderConsentConfirmed ?? false,
    };
    const { data, error } = await supabase.rpc("create_prescription_with_items", { input: payload as Json });
    if (error) throw error;
    const result = normalizePrescriptionRpcResult(data);
    logAuditEvent({ clinicId: result.prescription.clinic_id, branchId: result.prescription.branch_id, eventType: "prescription_created", entityType: "prescriptions", entityId: result.prescription.id, action: "create", status: "success", severity: "info", message: "Prescription created with items.", metadata: { item_count: result.items.length, patient_id: result.prescription.patient_id } });
    return result;
  },

  async updatePrescriptionDeliveryStatus(id, status, message) {
    const { data, error } = await supabase.rpc("update_prescription_delivery_status", {
      prescription_id: id,
      new_status: status,
      message,
    });
    if (error) throw error;
    return data;
  },

  async routePrescriptionToPharmacy(id) {
    const { data, error } = await supabase.rpc("route_prescription_to_pharmacy", { prescription_id: id });
    if (error) throw error;
    return data;
  },

  async sendPrescriptionToPatientPlaceholder(id) {
    const row = await this.updatePrescriptionDeliveryStatus(id, "sent", "WhatsApp placeholder marked as sent. No real message was sent.");
    logAuditEvent({ clinicId: row.clinic_id, branchId: row.branch_id, eventType: "prescription_placeholder_sent", entityType: "prescriptions", entityId: row.id, action: "send_placeholder", status: "success", severity: "info", message: "Prescription WhatsApp placeholder sent.", metadata: { noExternalApi: true, patient_id: row.patient_id } });
    return row;
  },

  async sendPrescriptionToWhatsApp(prescriptionId) {
    const prescription = await this.sendPrescriptionToPatientPlaceholder(prescriptionId);
    const items = await supabase.from("prescription_items").select("*").eq("prescription_id", prescriptionId).order("sort_order", { ascending: true });
    if (items.error) throw items.error;
    return mapPrescription(prescription, items.data ?? []);
  },

  async getMedicineReminders(patientId) {
    let query = supabase.from("medicine_reminders").select("*").order("next_run_at", { ascending: true });
    if (patientId) query = query.eq("patient_id", patientId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapReminder);
  },

  async createMedicineReminderSchedule(input) {
    const context = await supabaseAuthService.getCurrentAuthContext();
    const { data, error } = await supabase.from("medicine_reminders").insert({
      ...input,
      clinic_id: input.clinic_id || context.clinic_id || "",
      created_by: input.created_by ?? context.staffProfileId,
    }).select("*").single();
    if (error) throw error;
    return data;
  },

  async updateReminderStatus(id, status) {
    const { data, error } = await supabase.from("medicine_reminders").update({ status }).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },

  async getReminders(patientId) {
    return this.getMedicineReminders(patientId);
  },
};
