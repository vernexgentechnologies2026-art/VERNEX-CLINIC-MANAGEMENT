import type { PrescriptionRecord } from "../shared/types/domain";

// prescription.consultationId links clinical notes to pharmacy and reminder workflows.
export const mockPrescriptions: PrescriptionRecord[] = [
  { id: "rx-1001", consultationId: "consult-1001", patientId: "patient-neha", doctorId: "user-doctor-1", status: "sent_to_whatsapp", deliveryStatus: "delivered", followUpDate: "2026-07-11", items: [
    { id: "rx-item-1001-a", prescriptionId: "rx-1001", medicineId: "med-paracetamol", medicineName: "Paracetamol 500mg", dosage: "1 tablet", frequency: "1-1-1", timing: "Morning, afternoon, night", duration: "3 days", beforeAfterFood: "after_food" },
    { id: "rx-item-1001-b", prescriptionId: "rx-1001", medicineId: "med-ors", medicineName: "ORS Sachet", dosage: "1 sachet", frequency: "0-1-0", timing: "Afternoon", duration: "2 days", beforeAfterFood: "after_food" }
  ] },
  { id: "rx-1002", consultationId: "consult-1002", patientId: "patient-ramesh", doctorId: "user-doctor-1", status: "draft", deliveryStatus: "queued", items: [
    { id: "rx-item-1002-a", prescriptionId: "rx-1002", medicineId: "med-telmisartan", medicineName: "Telmisartan 40mg", dosage: "1 tablet", frequency: "1-0-0", timing: "Morning", duration: "30 days", beforeAfterFood: "before_food" }
  ] }
];
