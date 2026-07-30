import { medicines, pharmacyBills, pharmacyStats, prescriptionQueue, purchaseEntries } from "../modules/pharmacy/mock";
import type { PharmacyBill, PurchaseEntry, StockAdjustment } from "../modules/pharmacy/types";

export const getPharmacyStats = () => pharmacyStats;
export const getPrescriptionQueue = () => prescriptionQueue;
export const getMedicines = () => medicines;
export const getLowStockMedicines = () => medicines.filter((m) => m.stockStatus === "low_stock" || m.stockStatus === "out_of_stock");
export const getExpiryAlertMedicines = () => medicines.filter((m) => m.expiryStatus !== "safe" || m.stockStatus === "expired");
export const createPharmacyBill = (input: Partial<PharmacyBill>) => ({ ...pharmacyBills[0], ...input, id: `PH-${Date.now()}` });
export const updateMedicineStock = (medicineId: string, quantity: number) => ({ medicineId, quantity });
export const addPurchaseEntry = (input: Partial<PurchaseEntry>) => ({ ...purchaseEntries[0], ...input, id: `pe-${Date.now()}` });
export const adjustStock = (input: StockAdjustment) => ({ id: `adj-${Date.now()}`, ...input });
export const markPrescriptionDispensed = (id: string) => prescriptionQueue.map((rx) => rx.id === id ? { ...rx, status: "dispensed" as const } : rx);
export const getPharmacyBills = () => pharmacyBills;
export const getPurchaseEntries = () => purchaseEntries;
