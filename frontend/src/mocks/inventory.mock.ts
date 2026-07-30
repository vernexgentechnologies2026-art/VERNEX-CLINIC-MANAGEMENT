import type { InventoryRecord } from "../shared/types/domain";

// Inventory connects medicines to branch-level stock, batch, and expiry.
export const mockInventory: InventoryRecord[] = [
  { id: "inv-med-1", medicineId: "med-paracetamol", branchId: "branch-indiranagar", batchNumber: "PCM-B2407", quantity: 140, reorderLevel: 40, expiryDate: "2027-02-28", status: "in_stock" },
  { id: "inv-med-2", medicineId: "med-ors", branchId: "branch-indiranagar", batchNumber: "ORS-A2404", quantity: 12, reorderLevel: 20, expiryDate: "2026-10-15", status: "low_stock" },
  { id: "inv-med-3", medicineId: "med-cetirizine", branchId: "branch-indiranagar", batchNumber: "CET-X2309", quantity: 3, reorderLevel: 25, expiryDate: "2026-08-01", status: "expiring_soon" }
];
