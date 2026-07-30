import { mockInventory } from "../../mocks/inventory.mock";
import { mockMedicines } from "../../mocks/medicines.mock";
import { mockConfig, mockResolve } from "../../mocks/mockConfig";
import { mockPharmacyOrders } from "../../mocks/pharmacyOrders.mock";
import type { Tables } from "../../shared/types/database.types";
import type { PharmacyDomainService } from "../interfaces";

const now = () => new Date().toISOString();

function mockMedicineRow(input: Partial<Tables<"medicines">> = {}): Tables<"medicines"> {
  return {
    id: input.id ?? `medicine-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    name: input.name ?? "Paracetamol 500mg",
    generic_name: input.generic_name ?? null,
    category: input.category ?? "general",
    manufacturer: input.manufacturer ?? null,
    strength: input.strength ?? null,
    unit: input.unit ?? null,
    hsn_code: input.hsn_code ?? null,
    gst_rate: input.gst_rate ?? 0,
    reorder_level: input.reorder_level ?? 0,
    status: input.status ?? "active",
    metadata: input.metadata ?? {},
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

function mockBatchRow(input: Partial<Tables<"medicine_stock_batches">> = {}): Tables<"medicine_stock_batches"> {
  return {
    id: input.id ?? `batch-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    medicine_id: input.medicine_id ?? "medicine-1",
    batch_no: input.batch_no ?? "BATCH-1",
    expiry_date: input.expiry_date ?? null,
    quantity_available: input.quantity_available ?? 0,
    purchase_price: input.purchase_price ?? 0,
    selling_price: input.selling_price ?? 0,
    supplier_name: input.supplier_name ?? null,
    status: input.status ?? "active",
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

function mockOrderRow(input: Partial<Tables<"pharmacy_orders">> = {}): Tables<"pharmacy_orders"> {
  return {
    id: input.id ?? `order-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    prescription_id: input.prescription_id ?? "rx-1",
    patient_id: input.patient_id ?? "patient-1",
    doctor_id: input.doctor_id ?? null,
    status: input.status ?? "pending",
    total_items: input.total_items ?? 1,
    notes: input.notes ?? null,
    created_by: input.created_by ?? null,
    dispensed_by: input.dispensed_by ?? null,
    dispensed_at: input.dispensed_at ?? null,
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

export const mockPharmacyDomainService: PharmacyDomainService = {
  getMedicines: () => mockResolve(mockMedicines),
  getMedicineById: (id) => mockResolve(mockMedicineRow({ id })),
  createMedicine: (input) => mockResolve(mockMedicineRow(input)),
  updateMedicine: (id, input) => mockResolve(mockMedicineRow({ ...input, id })),
  getStockBatches: () => mockResolve([mockBatchRow()]),
  addStockBatch: (input) => mockResolve(mockBatchRow(input)),
  adjustStock: (input) => mockResolve(mockBatchRow({ id: input.batchId, quantity_available: input.quantity })),
  getPharmacyQueue: () => mockResolve([]),
  createOrderFromPrescription: (prescriptionId) => mockResolve(mockOrderRow({ prescription_id: prescriptionId })),
  dispenseOrder: (input) => mockResolve(mockOrderRow({ id: input.orderId, status: "dispensed", dispensed_at: now() })),
  getLowStockAlerts: () => mockResolve([]),
  refreshLowStockAlerts: () => mockResolve(0),
  getStockMovements: () => mockResolve([]),
  getInventory: (branchId) => mockResolve(branchId ? mockInventory.filter((item) => item.branchId === branchId) : mockInventory),
  getPharmacyOrders: (branchId) => mockResolve(mockConfig.useEmptyPharmacyQueue ? [] : branchId ? mockPharmacyOrders.filter((item) => item.branchId === branchId) : mockPharmacyOrders)
};
