import { supabase } from "../../lib/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "../../shared/types/database.types";
import type { LabTest, Medicine as FavoriteMedicine, PrescriptionTemplate } from "../../modules/doctor/types";
import type { PurchaseEntry } from "../../modules/pharmacy/types";
import type { Refund, RefundStatus } from "../../modules/billing/types";
import type { CatalogService, CreatePurchaseEntryInput, CreateRefundInput } from "../interfaces";
import { supabaseAuthService } from "./supabaseAuth.service";

type TemplateRow = Tables<"prescription_templates">;
type TemplateItemRow = Tables<"prescription_template_items">;
type PurchaseRow = Tables<"stock_purchases">;
type BatchRow = Tables<"medicine_stock_batches">;
type RefundRow = Tables<"invoice_refunds">;

async function clinicScope() {
  const context = await supabaseAuthService.getCurrentAuthContext();
  return { clinicId: context.clinic_id, branchId: context.branch_id, staffId: context.staffProfileId };
}

function toTemplate(row: TemplateRow, items: TemplateItemRow[]): PrescriptionTemplate {
  return {
    id: row.id,
    name: row.name,
    advice: row.advice ?? "",
    medicines: items
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: item.id,
        medicineName: item.medicine_name,
        dosage: item.dosage ?? "",
        frequency: item.frequency ?? "",
        timing: item.timing ?? "",
        duration: item.duration ?? "",
        instructions: item.instructions ?? undefined,
        quantity: item.quantity ?? undefined,
      })),
  };
}

function toPurchaseEntry(row: PurchaseRow, batches: BatchRow[], medicineNames: Map<string, string>): PurchaseEntry {
  return {
    id: row.id,
    supplierName: row.supplier_name,
    invoiceNumber: row.invoice_number,
    purchaseDate: row.purchase_date,
    totalAmount: row.total_amount ?? 0,
    status: row.status === "draft" ? "draft" : "saved",
    items: batches.map((batch) => ({
      medicineName: medicineNames.get(batch.medicine_id) ?? "Medicine",
      batchNumber: batch.batch_no,
      expiryDate: batch.expiry_date ?? "",
      quantity: batch.quantity_available ?? 0,
      purchasePrice: batch.purchase_price ?? 0,
      sellingPrice: batch.selling_price ?? 0,
      mrp: batch.mrp ?? batch.selling_price ?? 0,
    })),
  };
}

function toRefund(row: RefundRow, invoiceNumber: string, patientName: string): Refund {
  return {
    id: row.id,
    patientName,
    invoiceNumber,
    originalAmount: row.original_amount ?? 0,
    refundAmount: row.refund_amount ?? 0,
    reason: row.reason,
    status: row.status as RefundStatus,
    date: row.created_at?.slice(0, 10) ?? "",
  };
}

export const supabaseCatalogService: CatalogService = {
  async getClinicServices(clinicId) {
    let query = supabase.from("clinic_services").select("*").eq("status", "active").order("sort_order", { ascending: true }).order("name", { ascending: true });
    if (clinicId) query = query.eq("clinic_id", clinicId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async createClinicService(input: TablesInsert<"clinic_services">) {
    const scope = await clinicScope();
    const { data, error } = await supabase
      .from("clinic_services")
      .insert({ ...input, clinic_id: input.clinic_id || scope.clinicId || "", created_by: input.created_by ?? scope.staffId })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  async updateClinicService(id, input: TablesUpdate<"clinic_services">) {
    const { data, error } = await supabase.from("clinic_services").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },

  async getPrescriptionTemplates(doctorId) {
    let query = supabase.from("prescription_templates").select("*").eq("status", "active").order("name", { ascending: true });
    // A template with no doctor_id is shared across the clinic.
    if (doctorId) query = query.or(`doctor_id.eq.${doctorId},doctor_id.is.null`);
    const { data: templates, error } = await query;
    if (error) throw error;
    if (!templates || templates.length === 0) return [];
    const { data: items, error: itemsError } = await supabase
      .from("prescription_template_items")
      .select("*")
      .in("template_id", templates.map((template) => template.id));
    if (itemsError) throw itemsError;
    return templates.map((template) => toTemplate(template, (items ?? []).filter((item) => item.template_id === template.id)));
  },

  async getLabTests() {
    const { data, error } = await supabase.from("lab_tests").select("*").eq("status", "active").order("sort_order", { ascending: true }).order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row): LabTest => ({ id: row.id, name: row.name }));
  },

  async getFavoriteMedicines(doctorId) {
    let query = supabase.from("doctor_favorite_medicines").select("*").order("usage_count", { ascending: false }).order("sort_order", { ascending: true }).limit(12);
    if (doctorId) query = query.or(`doctor_id.eq.${doctorId},doctor_id.is.null`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row): FavoriteMedicine => ({ id: row.id, name: row.medicine_name, form: row.default_dosage ?? "" }));
  },

  async recordMedicineUsage(doctorId, medicineNames) {
    const names = Array.from(new Set(medicineNames.map((name) => name.trim()).filter(Boolean)));
    if (names.length === 0) return;
    const scope = await clinicScope();
    if (!scope.clinicId) return;
    const { data: existing, error } = await supabase
      .from("doctor_favorite_medicines")
      .select("id,medicine_name,usage_count")
      .eq("clinic_id", scope.clinicId)
      .eq("doctor_id", doctorId)
      .in("medicine_name", names);
    if (error) throw error;
    const byName = new Map((existing ?? []).map((row) => [row.medicine_name, row]));
    const inserts = names.filter((name) => !byName.has(name)).map((name) => ({ clinic_id: scope.clinicId!, doctor_id: doctorId, medicine_name: name, usage_count: 1 }));
    if (inserts.length > 0) {
      const { error: insertError } = await supabase.from("doctor_favorite_medicines").insert(inserts);
      if (insertError) throw insertError;
    }
    await Promise.all(
      (existing ?? []).map((row) =>
        supabase.from("doctor_favorite_medicines").update({ usage_count: (row.usage_count ?? 0) + 1 }).eq("id", row.id),
      ),
    );
  },

  async getPurchaseEntries() {
    const { data: purchases, error } = await supabase.from("stock_purchases").select("*").order("purchase_date", { ascending: false }).limit(20);
    if (error) throw error;
    if (!purchases || purchases.length === 0) return [];
    const { data: batches, error: batchError } = await supabase
      .from("medicine_stock_batches")
      .select("*")
      .in("purchase_id", purchases.map((purchase) => purchase.id));
    if (batchError) throw batchError;
    const medicineIds = Array.from(new Set((batches ?? []).map((batch) => batch.medicine_id)));
    const { data: medicines, error: medicineError } = medicineIds.length
      ? await supabase.from("medicines").select("id,name").in("id", medicineIds)
      : { data: [], error: null };
    if (medicineError) throw medicineError;
    const names = new Map((medicines ?? []).map((medicine) => [medicine.id, medicine.name]));
    return purchases.map((purchase) => toPurchaseEntry(purchase, (batches ?? []).filter((batch) => batch.purchase_id === purchase.id), names));
  },

  async createPurchaseEntry(input: CreatePurchaseEntryInput) {
    const scope = await clinicScope();
    if (!scope.clinicId) throw new Error("An active clinic context is required to record a purchase.");
    const totalAmount = input.items.reduce((total, item) => total + item.quantity * item.purchasePrice, 0);

    const { data: purchase, error } = await supabase
      .from("stock_purchases")
      .insert({
        clinic_id: scope.clinicId,
        branch_id: scope.branchId,
        supplier_name: input.supplierName,
        supplier_phone: input.supplierPhone ?? null,
        invoice_number: input.invoiceNumber,
        purchase_date: input.purchaseDate,
        notes: input.notes ?? null,
        total_amount: totalAmount,
        status: "saved",
        created_by: scope.staffId,
      })
      .select("*")
      .single();
    if (error) throw error;

    const batches: BatchRow[] = [];
    const medicineNames = new Map<string, string>();

    for (const item of input.items) {
      const { data: found, error: findError } = await supabase
        .from("medicines")
        .select("*")
        .eq("clinic_id", scope.clinicId)
        .ilike("name", item.medicineName)
        .maybeSingle();
      if (findError) throw findError;

      let medicine = found;
      if (!medicine) {
        const { data: created, error: createError } = await supabase
          .from("medicines")
          .insert({ clinic_id: scope.clinicId, branch_id: scope.branchId, name: item.medicineName, category: item.category ?? "general", unit: "unit", status: "active" })
          .select("*")
          .single();
        if (createError) throw createError;
        medicine = created;
      }
      medicineNames.set(medicine.id, medicine.name);

      const { data: batch, error: batchError } = await supabase
        .from("medicine_stock_batches")
        .upsert(
          {
            clinic_id: scope.clinicId,
            branch_id: medicine.branch_id ?? scope.branchId,
            medicine_id: medicine.id,
            purchase_id: purchase.id,
            batch_no: item.batchNumber,
            expiry_date: item.expiryDate || null,
            quantity_available: item.quantity,
            purchase_price: item.purchasePrice,
            selling_price: item.sellingPrice,
            mrp: item.mrp ?? item.sellingPrice,
            supplier_name: input.supplierName,
            status: "active",
          },
          { onConflict: "medicine_id,batch_no" },
        )
        .select("*")
        .single();
      if (batchError) throw batchError;
      batches.push(batch);

      const { error: movementError } = await supabase.from("stock_movements").insert({
        clinic_id: scope.clinicId,
        branch_id: batch.branch_id,
        medicine_id: medicine.id,
        batch_id: batch.id,
        movement_type: "add_stock",
        quantity: item.quantity,
        reason: `Purchase ${input.invoiceNumber}`,
        reference_type: "stock_purchases",
        reference_id: purchase.id,
        created_by: scope.staffId,
      });
      if (movementError) throw movementError;
    }

    return toPurchaseEntry(purchase, batches, medicineNames);
  },

  async getRefunds() {
    const { data: refunds, error } = await supabase.from("invoice_refunds").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    if (!refunds || refunds.length === 0) return [];
    const [{ data: invoices }, { data: patients }] = await Promise.all([
      supabase.from("invoices").select("id,invoice_number").in("id", refunds.map((refund) => refund.invoice_id)),
      supabase.from("patients").select("id,full_name").in("id", refunds.map((refund) => refund.patient_id)),
    ]);
    const invoiceNumbers = new Map((invoices ?? []).map((invoice) => [invoice.id, invoice.invoice_number]));
    const patientNames = new Map((patients ?? []).map((patient) => [patient.id, patient.full_name]));
    return refunds.map((refund) => toRefund(refund, invoiceNumbers.get(refund.invoice_id) ?? refund.invoice_id, patientNames.get(refund.patient_id) ?? "Patient"));
  },

  async createRefund(input: CreateRefundInput) {
    const scope = await clinicScope();
    const { data: invoice, error: invoiceError } = await supabase.from("invoices").select("*").eq("id", input.invoiceId).single();
    if (invoiceError) throw invoiceError;

    const { data, error } = await supabase
      .from("invoice_refunds")
      .insert({
        clinic_id: invoice.clinic_id,
        branch_id: invoice.branch_id,
        invoice_id: invoice.id,
        patient_id: invoice.patient_id,
        original_amount: invoice.total_amount ?? 0,
        refund_amount: input.refundAmount,
        refund_mode: input.refundMode ?? "cash",
        reason: input.reason,
        status: "requested",
        requested_by: scope.staffId,
      })
      .select("*")
      .single();
    if (error) throw error;

    const { data: patient } = await supabase.from("patients").select("full_name").eq("id", invoice.patient_id).maybeSingle();
    return toRefund(data, invoice.invoice_number, patient?.full_name ?? "Patient");
  },

  async updateRefundStatus(id, status) {
    const scope = await clinicScope();
    const { data, error } = await supabase
      .from("invoice_refunds")
      .update({
        status,
        approved_by: status === "approved" || status === "processed" ? scope.staffId : null,
        processed_at: status === "processed" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    const [{ data: invoice }, { data: patient }] = await Promise.all([
      supabase.from("invoices").select("invoice_number").eq("id", data.invoice_id).maybeSingle(),
      supabase.from("patients").select("full_name").eq("id", data.patient_id).maybeSingle(),
    ]);
    return toRefund(data, invoice?.invoice_number ?? data.invoice_id, patient?.full_name ?? "Patient");
  },
};
