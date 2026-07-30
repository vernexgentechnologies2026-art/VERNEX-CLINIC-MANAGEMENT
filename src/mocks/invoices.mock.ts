import type { InvoiceRecord } from "../shared/types/domain";

export const mockInvoices: InvoiceRecord[] = [
  { id: "inv-1001", clinicId: "clinic-vernex", branchId: "branch-indiranagar", patientId: "patient-neha", appointmentId: "apt-wa-1001", amount: 950, paidAmount: 0, status: "pending", createdAt: "2026-07-09T10:45:00+05:30" },
  { id: "inv-1002", clinicId: "clinic-vernex", branchId: "branch-indiranagar", patientId: "patient-ramesh", appointmentId: "apt-phone-1002", amount: 1200, paidAmount: 600, status: "partial", createdAt: "2026-07-09T11:30:00+05:30" }
];
