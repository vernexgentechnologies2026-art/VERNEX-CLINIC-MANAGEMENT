import type { PharmacyOrderRecord } from "../shared/types/domain";

// Pharmacy orders are created from prescriptions and may become pharmacy bills.
export const mockPharmacyOrders: PharmacyOrderRecord[] = [
  { id: "ph-order-1001", prescriptionId: "rx-1001", patientId: "patient-neha", branchId: "branch-indiranagar", status: "ready", paymentStatus: "pending", unavailableItems: [] },
  { id: "ph-order-1002", prescriptionId: "rx-1002", patientId: "patient-ramesh", branchId: "branch-indiranagar", status: "received", paymentStatus: "pending", unavailableItems: ["Telmisartan alternate strength required"] }
];
