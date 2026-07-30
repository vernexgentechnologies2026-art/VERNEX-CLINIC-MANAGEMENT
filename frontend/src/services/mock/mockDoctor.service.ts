import { mockConsultations } from "../../mocks/consultations.mock";
import { mockDoctorAvailability } from "../../mocks/doctorAvailability.mock";
import { mockResolve } from "../../mocks/mockConfig";
import { mockPrescriptions } from "../../mocks/prescriptions.mock";
import { mockReminders } from "../../mocks/reminders.mock";
import type { Tables } from "../../shared/types/database.types";
import type { DoctorDomainService } from "../interfaces";

const now = () => new Date().toISOString();

function mockConsultationRow(input: Partial<Tables<"consultations">> = {}): Tables<"consultations"> {
  return {
    id: input.id ?? `consultation-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    appointment_id: input.appointment_id ?? "appointment-1",
    patient_id: input.patient_id ?? "p1",
    doctor_id: input.doctor_id ?? "doctor-1",
    symptoms: input.symptoms ?? "",
    diagnosis: input.diagnosis ?? "",
    clinical_notes: input.clinical_notes ?? "",
    advice: input.advice ?? "",
    follow_up_date: input.follow_up_date ?? null,
    follow_up_reason: input.follow_up_reason ?? "",
    status: input.status ?? "draft",
    created_by: input.created_by ?? null,
    completed_at: input.completed_at ?? null,
    metadata: input.metadata ?? {},
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

function mockPrescriptionRow(input: Partial<Tables<"prescriptions">> = {}): Tables<"prescriptions"> {
  return {
    id: input.id ?? `rx-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    consultation_id: input.consultation_id ?? "consultation-1",
    appointment_id: input.appointment_id ?? null,
    patient_id: input.patient_id ?? "p1",
    doctor_id: input.doctor_id ?? "doctor-1",
    diagnosis_summary: input.diagnosis_summary ?? null,
    advice: input.advice ?? null,
    follow_up_date: input.follow_up_date ?? null,
    status: input.status ?? "draft",
    delivery_status: input.delivery_status ?? "queued",
    delivery_channel: input.delivery_channel ?? "none",
    send_to_pharmacy: input.send_to_pharmacy ?? false,
    pharmacy_status: input.pharmacy_status ?? "not_sent",
    created_by: input.created_by ?? null,
    finalized_at: input.finalized_at ?? null,
    metadata: input.metadata ?? {},
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

function mockPrescriptionItemRow(input: Partial<Tables<"prescription_items">> = {}): Tables<"prescription_items"> {
  return {
    id: input.id ?? `rx-item-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    prescription_id: input.prescription_id ?? "rx-1",
    medicine_id: input.medicine_id ?? null,
    medicine_name: input.medicine_name ?? "Paracetamol 500mg",
    dosage: input.dosage ?? "1 tablet",
    frequency: input.frequency ?? "1-0-1",
    timing: input.timing ?? "After food",
    duration: input.duration ?? "3 days",
    food_instruction: input.food_instruction ?? "after_food",
    quantity: input.quantity ?? null,
    instructions: input.instructions ?? null,
    sort_order: input.sort_order ?? 0,
    reminder_enabled: input.reminder_enabled ?? false,
    reminder_frequency: input.reminder_frequency ?? null,
    reminder_start_date: input.reminder_start_date ?? null,
    reminder_end_date: input.reminder_end_date ?? null,
    metadata: input.metadata ?? {},
    created_at: input.created_at ?? now(),
  };
}

function mockReminderRow(input: Partial<Tables<"medicine_reminders">> = {}): Tables<"medicine_reminders"> {
  return {
    id: input.id ?? `reminder-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    patient_id: input.patient_id ?? "p1",
    prescription_id: input.prescription_id ?? "rx-1",
    prescription_item_id: input.prescription_item_id ?? null,
    medicine_name: input.medicine_name ?? "Paracetamol 500mg",
    dosage: input.dosage ?? null,
    frequency: input.frequency ?? null,
    timing: input.timing ?? null,
    start_date: input.start_date ?? now().slice(0, 10),
    end_date: input.end_date ?? null,
    next_run_at: input.next_run_at ?? now(),
    status: input.status ?? "active",
    delivery_status: input.delivery_status ?? "queued",
    consent_confirmed: input.consent_confirmed ?? false,
    metadata: input.metadata ?? {},
    created_by: input.created_by ?? null,
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

export const mockDoctorDomainService: DoctorDomainService = {
  getDoctorProfiles: () => mockResolve([]),
  getDoctorProfileByStaffId: () => mockResolve(null),
  getDoctorAvailability: (doctorId) => mockResolve(mockDoctorAvailability.filter((item) => item.doctorId === doctorId)),
  updateDoctorAvailability: (input) => mockResolve(input.map((item) => ({ ...item, id: `availability-${Date.now()}`, created_at: new Date().toISOString(), branch_id: item.branch_id ?? null, break_start: item.break_start ?? null, break_end: item.break_end ?? null, day_of_week: item.day_of_week ?? null, is_active: item.is_active ?? true }))),
  getDoctorBlockedDates: () => mockResolve([]),
  blockDoctorDate: (input) => mockResolve({ ...input, id: `blocked-${Date.now()}`, created_at: new Date().toISOString(), created_by: input.created_by ?? null, reason: input.reason ?? null }),
  getAvailableSlots: () => mockResolve([]),
  generateSlotsForDoctor: () => mockResolve([]),
  getConsultations: (patientId) => mockResolve(patientId ? mockConsultations.filter((item) => item.patientId === patientId) : mockConsultations),
  getConsultationById: (id) => mockResolve(mockConsultationRow({ id })),
  getConsultationsByPatient: (patientId) => mockResolve([mockConsultationRow({ patient_id: patientId })]),
  getConsultationByAppointment: (appointmentId) => mockResolve(mockConsultationRow({ appointment_id: appointmentId })),
  createConsultation: (input) => mockResolve(mockConsultationRow(input)),
  updateConsultation: (id, input) => mockResolve(mockConsultationRow({ ...input, id })),
  completeConsultation: (id) => mockResolve(mockConsultationRow({ id, status: "completed", completed_at: now() })),
  saveVitals: (input) => mockResolve({ ...input, id: `vitals-${Date.now()}`, created_at: now(), blood_pressure: input.blood_pressure ?? null, blood_sugar: input.blood_sugar ?? null, height_cm: input.height_cm ?? null, notes: input.notes ?? null, oxygen_saturation: input.oxygen_saturation ?? null, pulse_rate: input.pulse_rate ?? null, respiratory_rate: input.respiratory_rate ?? null, temperature_c: input.temperature_c ?? null, weight_kg: input.weight_kg ?? null }),
  getVitals: () => mockResolve([]),
  addConsultationNote: (input) => mockResolve({ ...input, id: `note-${Date.now()}`, created_at: now(), created_by: input.created_by ?? null, note_type: input.note_type ?? "general" }),
  getConsultationNotes: () => mockResolve([]),
  getPrescriptions: (filters) => {
    const patientId = typeof filters === "string" ? filters : filters?.patientId;
    const consultationId = typeof filters === "string" ? undefined : filters?.consultationId;
    return mockResolve(mockPrescriptions.filter((item) => (!patientId || item.patientId === patientId) && (!consultationId || item.consultationId === consultationId)));
  },
  getPrescriptionById: (id) => mockResolve({ prescription: mockPrescriptionRow({ id }), items: [mockPrescriptionItemRow({ prescription_id: id })] }),
  getPrescriptionsByPatient: (patientId) => mockResolve(mockPrescriptions.filter((item) => item.patientId === patientId)),
  getPrescriptionsByConsultation: (consultationId) => mockResolve(mockPrescriptions.filter((item) => item.consultationId === consultationId)),
  createPrescription: (input) => mockResolve(mockPrescriptionRow(input)),
  updatePrescription: (id, input) => mockResolve(mockPrescriptionRow({ ...input, id })),
  createPrescriptionWithItems: (input) => {
    const prescription = mockPrescriptionRow(input.prescription);
    return mockResolve({ prescription, items: input.items.map((item) => mockPrescriptionItemRow({ ...item, prescription_id: prescription.id, clinic_id: prescription.clinic_id })) });
  },
  updatePrescriptionDeliveryStatus: (id, status) => mockResolve(mockPrescriptionRow({ id, delivery_status: status })),
  routePrescriptionToPharmacy: (id) => mockResolve(mockPrescriptionRow({ id, send_to_pharmacy: true, pharmacy_status: "sent_to_pharmacy" })),
  sendPrescriptionToPatientPlaceholder: (id) => mockResolve(mockPrescriptionRow({ id, delivery_channel: "whatsapp", delivery_status: "sent" })),
  sendPrescriptionToWhatsApp: (prescriptionId) => mockResolve({ ...(mockPrescriptions.find((item) => item.id === prescriptionId) ?? mockPrescriptions[0]), status: "sent_to_whatsapp", deliveryStatus: "queued" }),
  getMedicineReminders: (patientId) => mockResolve(patientId ? mockReminders.filter((item) => item.patientId === patientId) : mockReminders),
  createMedicineReminderSchedule: (input) => mockResolve(mockReminderRow(input)),
  updateReminderStatus: (id, status) => mockResolve(mockReminderRow({ id, status })),
  getReminders: (patientId) => mockResolve(patientId ? mockReminders.filter((item) => item.patientId === patientId) : mockReminders)
};
