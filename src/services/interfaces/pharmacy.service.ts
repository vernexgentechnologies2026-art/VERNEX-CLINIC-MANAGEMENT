import type { InventoryRecord, MedicineRecord, PharmacyOrderRecord } from "../../shared/types/domain";

export interface PharmacyDomainService {
  getMedicines(): Promise<MedicineRecord[]>;
  getInventory(branchId?: string): Promise<InventoryRecord[]>;
  getPharmacyOrders(branchId?: string): Promise<PharmacyOrderRecord[]>;
}
