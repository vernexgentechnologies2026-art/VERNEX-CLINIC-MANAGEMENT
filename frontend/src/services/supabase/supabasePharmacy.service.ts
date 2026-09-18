import { supabase } from "../../lib/supabaseClient";
import type { InventoryRecord, MedicineRecord, PharmacyOrderRecord, StockStatus } from "../../shared/types/domain";
import type { Json, Tables, TablesInsert, TablesUpdate } from "../../shared/types/database.types";
import type { DispenseOrderInput, MedicineFilters, PharmacyDomainService, PharmacyQueueItem } from "../interfaces";
import type { PharmacyBill } from "../../modules/pharmacy/types";
import { logAuditEvent } from "./auditLogger";
import { supabaseAuthService } from "./supabaseAuth.service";

type MedicineRow = Tables<"medicines">;
type BatchRow = Tables<"medicine_stock_batches">;
type OrderRow = Tables<"pharmacy_orders">;
type OrderItemRow = Tables<"pharmacy_order_items">;

function mapMedicine(row: MedicineRow): MedicineRecord {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? "general",
    form: row.unit ?? row.strength ?? "",
    manufacturer: row.manufacturer ?? "",
  };
}

function stockStatus(batch: BatchRow, medicine?: MedicineRow | null): StockStatus {
  if (batch.expiry_date && batch.expiry_date < new Date().toISOString().slice(0, 10)) return "expired";
  if ((batch.quantity_available ?? 0) <= 0) return "out_of_stock";
  if ((batch.quantity_available ?? 0) <= (medicine?.reorder_level ?? 0)) return "low_stock";
  return "in_stock";
}

function mapInventory(row: BatchRow & { medicines?: MedicineRow | null }): InventoryRecord {
  return {
    id: row.id,
    medicineId: row.medicine_id,
    branchId: row.branch_id ?? "",
    batchNumber: row.batch_no,
    quantity: row.quantity_available ?? 0,
    reorderLevel: row.medicines?.reorder_level ?? 0,
    expiryDate: row.expiry_date ?? "",
    status: stockStatus(row, row.medicines) as InventoryRecord["status"],
  };
}

function mapOrder(row: OrderRow): PharmacyOrderRecord {
  return {
    id: row.id,
    prescriptionId: row.prescription_id,
    patientId: row.patient_id,
    branchId: row.branch_id ?? "",
    status: row.status === "dispensed" ? "dispensed" : row.status === "cancelled" ? "cancelled" : row.status === "partially_dispensed" ? "preparing" : "received",
    paymentStatus: "pending",
    unavailableItems: [],
  };
}

function cleanSearch(query: string) {
  return query.replace(/[%_,]/g, " ").trim();
}

async function currentContext() {
  return supabaseAuthService.getCurrentAuthContext();
}

export const supabasePharmacyDomainService: PharmacyDomainService = {
  async getMedicines(filters?: MedicineFilters) {
    let query = supabase.from("medicines").select("*").order("name", { ascending: true });
    if (filters?.clinicId) query = query.eq("clinic_id", filters.clinicId);
    if (filters?.branchId) query = query.or(`branch_id.is.null,branch_id.eq.${filters.branchId}`);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.query) {
      const search = cleanSearch(filters.query);
      if (search) query = query.or(`name.ilike.%${search}%,generic_name.ilike.%${search}%,manufacturer.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapMedicine);
  },

  async getMedicineById(id) {
    const { data, error } = await supabase.from("medicines").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async createMedicine(input: TablesInsert<"medicines">) {
    const context = await currentContext();
    const payload: TablesInsert<"medicines"> = {
      ...input,
      clinic_id: input.clinic_id || context.clinic_id || "",
      branch_id: input.branch_id ?? context.branch_id,
      status: input.status ?? "active",
    };
    const { data, error } = await supabase.from("medicines").insert(payload).select("*").single();
    if (error) throw error;
    return data;
  },

  async updateMedicine(id, input: TablesUpdate<"medicines">) {
    const { data, error } = await supabase.from("medicines").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },

  async getStockBatches(medicineId) {
    let query = supabase.from("medicine_stock_batches").select("*").order("expiry_date", { ascending: true });
    if (medicineId) query = query.eq("medicine_id", medicineId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async addStockBatch(input: TablesInsert<"medicine_stock_batches">) {
    const context = await currentContext();
    const payload: TablesInsert<"medicine_stock_batches"> = {
      ...input,
      clinic_id: input.clinic_id || context.clinic_id || "",
      branch_id: input.branch_id ?? context.branch_id,
      status: input.status ?? "active",
    };
    const { data, error } = await supabase.from("medicine_stock_batches").insert(payload).select("*").single();
    if (error) throw error;
    await this.refreshLowStockAlerts(payload.clinic_id, payload.branch_id ?? undefined);
    return data;
  },

  async adjustStock(input) {
    const payload = {
      batch_id: input.batchId,
      movement_type: input.movementType,
      quantity: input.quantity,
      reason: input.reason,
      reference_type: input.referenceType,
      reference_id: input.referenceId,
    };
    const { data, error } = await supabase.rpc("adjust_medicine_stock", { input: payload as Json });
    if (error) throw error;
    logAuditEvent({ clinicId: data.clinic_id, branchId: data.branch_id, eventType: "pharmacy_stock_adjusted", entityType: "medicine_stock_batches", entityId: data.id, action: "stock_adjust", status: "success", severity: "info", message: "Medicine stock adjusted.", metadata: { movement_type: input.movementType, quantity: input.quantity } });
    return data;
  },

  async getPharmacyQueue() {
    const { data, error } = await supabase
      .from("pharmacy_orders")
      .select("*, pharmacy_order_items(*), prescriptions(*), patients(*), doctor_profiles(*, staff_profiles(full_name))")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...row,
      items: row.pharmacy_order_items ?? [],
      prescription: row.prescriptions ?? null,
      patient: row.patients ?? null,
      doctor: row.doctor_profiles ?? null,
    })) as PharmacyQueueItem[];
  },

  async createOrderFromPrescription(prescriptionId) {
    const { data, error } = await supabase.rpc("create_pharmacy_order_from_prescription", { prescription_id: prescriptionId });
    if (error) throw error;
    return data;
  },

  async dispenseOrder(input: DispenseOrderInput) {
    const payload = {
      order_id: input.orderId,
      items: input.items.map((item) => ({ order_item_id: item.orderItemId, batch_id: item.batchId, quantity: item.quantity })),
    };
    const { data, error } = await supabase.rpc("dispense_pharmacy_order", { input: payload as Json });
    if (error) throw error;
    logAuditEvent({ clinicId: data.clinic_id, branchId: data.branch_id, eventType: "pharmacy_order_dispensed", entityType: "pharmacy_orders", entityId: data.id, action: "dispense", status: "success", severity: "info", message: "Pharmacy order dispensed.", metadata: { item_count: input.items.length, patient_id: data.patient_id } });
    return data;
  },

  async getLowStockAlerts() {
    const { data, error } = await supabase.from("low_stock_alerts").select("*").eq("status", "active").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async refreshLowStockAlerts(clinicId, branchId) {
    const context = await currentContext();
    const { data, error } = await supabase.rpc("refresh_low_stock_alerts", {
      clinic_id: clinicId || context.clinic_id || "",
      branch_id: branchId,
    });
    if (error) throw error;
    return data ?? 0;
  },

  async getStockMovements(medicineId) {
    let query = supabase.from("stock_movements").select("*").order("created_at", { ascending: false });
    if (medicineId) query = query.eq("medicine_id", medicineId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getInventory(branchId) {
    let query = supabase.from("medicine_stock_batches").select("*, medicines(*)").order("expiry_date", { ascending: true });
    if (branchId) query = query.eq("branch_id", branchId);
    const { data, error } = await query;
    if (error) throw error;
    return ((data ?? []) as Array<BatchRow & { medicines?: MedicineRow | null }>).map(mapInventory);
  },

  async getPharmacyOrders(branchId) {
    let query = supabase.from("pharmacy_orders").select("*").order("created_at", { ascending: false });
    if (branchId) query = query.eq("branch_id", branchId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapOrder);
  },

  async getPharmacyBills(dateFrom) {
    let query = supabase.from("invoices").select("*").eq("invoice_type", "pharmacy").order("created_at", { ascending: false }).limit(50);
    if (dateFrom) query = query.gte("created_at", `${dateFrom}T00:00:00`);
    const { data: invoices, error } = await query;
    if (error) throw error;
    const rows = invoices ?? [];
    if (rows.length === 0) return [];

    const invoiceIds = rows.map((row) => row.id);
    const [{ data: items }, { data: patients }, { data: payments }] = await Promise.all([
      supabase.from("invoice_items").select("*").in("invoice_id", invoiceIds),
      supabase.from("patients").select("id,full_name").in("id", Array.from(new Set(rows.map((row) => row.patient_id)))),
      supabase.from("manual_payment_records").select("invoice_id,payment_mode").in("invoice_id", invoiceIds),
    ]);
    const patientNames = new Map((patients ?? []).map((patient) => [patient.id, patient.full_name]));
    const modes = new Map((payments ?? []).map((payment) => [payment.invoice_id, payment.payment_mode]));

    return rows.map((row): PharmacyBill => ({
      id: row.invoice_number || row.id,
      patientName: patientNames.get(row.patient_id) ?? "Patient",
      doctorName: "",
      prescriptionId: row.prescription_id ?? undefined,
      subtotal: row.subtotal ?? 0,
      discount: row.discount_amount ?? 0,
      total: row.total_amount ?? 0,
      paymentMode: (modes.get(row.id) ?? "cash") as PharmacyBill["paymentMode"],
      paymentStatus: row.payment_status === "paid" ? "paid" : row.payment_status === "partial" ? "partial" : "pending",
      createdAt: row.created_at?.slice(0, 16).replace("T", " ") ?? "",
      items: (items ?? [])
        .filter((item) => item.invoice_id === row.id)
        .map((item) => ({
          medicineName: item.description,
          quantity: item.quantity ?? 1,
          unitPrice: item.unit_price ?? 0,
          discount: item.discount_amount ?? 0,
        })),
    }));
  },
};
