import type { InventoryRecord, MedicineRecord, PharmacyOrderRecord } from "../../shared/types/domain";
import type { Tables, TablesInsert, TablesUpdate } from "../../shared/types/database.types";

export type MedicineFilters = {
  clinicId?: string;
  branchId?: string;
  query?: string;
  status?: string;
};

export type PharmacyQueueItem = Tables<"pharmacy_orders"> & {
  items: Tables<"pharmacy_order_items">[];
  prescription?: Tables<"prescriptions"> | null;
  patient?: Tables<"patients"> | null;
  doctor?: (Tables<"doctor_profiles"> & { staff_profiles?: Pick<Tables<"staff_profiles">, "full_name"> | null }) | null;
};

export type DispenseOrderInput = {
  orderId: string;
  items: Array<{ orderItemId: string; batchId: string; quantity: number }>;
};

export interface PharmacyDomainService {
  getMedicines(filters?: MedicineFilters): Promise<MedicineRecord[]>;
  getMedicineById(id: string): Promise<Tables<"medicines"> | null>;
  createMedicine(input: TablesInsert<"medicines">): Promise<Tables<"medicines">>;
  updateMedicine(id: string, input: TablesUpdate<"medicines">): Promise<Tables<"medicines">>;
  getStockBatches(medicineId?: string): Promise<Tables<"medicine_stock_batches">[]>;
  addStockBatch(input: TablesInsert<"medicine_stock_batches">): Promise<Tables<"medicine_stock_batches">>;
  adjustStock(input: { batchId: string; movementType: string; quantity: number; reason?: string; referenceType?: string; referenceId?: string }): Promise<Tables<"medicine_stock_batches">>;
  getPharmacyQueue(): Promise<PharmacyQueueItem[]>;
  createOrderFromPrescription(prescriptionId: string): Promise<Tables<"pharmacy_orders">>;
  dispenseOrder(input: DispenseOrderInput): Promise<Tables<"pharmacy_orders">>;
  getLowStockAlerts(): Promise<Tables<"low_stock_alerts">[]>;
  refreshLowStockAlerts(clinicId?: string, branchId?: string): Promise<number>;
  getStockMovements(medicineId?: string): Promise<Tables<"stock_movements">[]>;
  getInventory(branchId?: string): Promise<InventoryRecord[]>;
  getPharmacyOrders(branchId?: string): Promise<PharmacyOrderRecord[]>;
}
