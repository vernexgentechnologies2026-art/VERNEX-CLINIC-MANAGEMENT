import type { Tables, TablesInsert, TablesUpdate } from "../../shared/types/database.types";
import type { LabTest, PrescriptionTemplate } from "../../modules/doctor/types";
import type { Medicine as FavoriteMedicine } from "../../modules/doctor/types";
import type { PurchaseEntry } from "../../modules/pharmacy/types";
import type { Refund } from "../../modules/billing/types";

export type ClinicServiceRow = Tables<"clinic_services">;

export type CreatePurchaseEntryInput = {
  supplierName: string;
  supplierPhone?: string;
  invoiceNumber: string;
  purchaseDate: string;
  notes?: string;
  items: Array<{
    medicineName: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    mrp?: number;
    category?: string;
  }>;
};

export type CreateRefundInput = {
  invoiceId: string;
  refundAmount: number;
  reason: string;
  refundMode?: string;
};

/**
 * Clinic-level reference data that the UI used to read from local mock files:
 * bookable services, prescription templates, lab tests, doctor favourites,
 * pharmacy purchase history and billing refunds.
 */
export interface CatalogService {
  getClinicServices(clinicId?: string): Promise<ClinicServiceRow[]>;
  createClinicService(input: TablesInsert<"clinic_services">): Promise<ClinicServiceRow>;
  updateClinicService(id: string, input: TablesUpdate<"clinic_services">): Promise<ClinicServiceRow>;

  getPrescriptionTemplates(doctorId?: string): Promise<PrescriptionTemplate[]>;
  getLabTests(): Promise<LabTest[]>;
  getFavoriteMedicines(doctorId?: string): Promise<FavoriteMedicine[]>;
  recordMedicineUsage(doctorId: string, medicineNames: string[]): Promise<void>;

  getPurchaseEntries(): Promise<PurchaseEntry[]>;
  createPurchaseEntry(input: CreatePurchaseEntryInput): Promise<PurchaseEntry>;

  getRefunds(): Promise<Refund[]>;
  createRefund(input: CreateRefundInput): Promise<Refund>;
  updateRefundStatus(id: string, status: Refund["status"]): Promise<Refund>;
}
