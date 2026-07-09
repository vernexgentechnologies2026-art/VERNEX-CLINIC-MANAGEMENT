import { mockInventory } from "../../mocks/inventory.mock";
import { mockMedicines } from "../../mocks/medicines.mock";
import { mockConfig, mockResolve } from "../../mocks/mockConfig";
import { mockPharmacyOrders } from "../../mocks/pharmacyOrders.mock";
import type { PharmacyDomainService } from "../interfaces";

export const mockPharmacyDomainService: PharmacyDomainService = {
  getMedicines: () => mockResolve(mockMedicines),
  getInventory: (branchId) => mockResolve(branchId ? mockInventory.filter((item) => item.branchId === branchId) : mockInventory),
  getPharmacyOrders: (branchId) => mockResolve(mockConfig.useEmptyPharmacyQueue ? [] : branchId ? mockPharmacyOrders.filter((item) => item.branchId === branchId) : mockPharmacyOrders)
};
