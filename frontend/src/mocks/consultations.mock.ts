import type { ConsultationRecord } from "../shared/types/domain";

// Consultation references appointmentId and becomes the parent for prescriptions.
export const mockConsultations: ConsultationRecord[] = [
  { id: "consult-1001", appointmentId: "apt-wa-1001", patientId: "patient-neha", doctorId: "user-doctor-1", symptoms: "Fever, sore throat, fatigue", vitals: { temperature: "101 F", bp: "118/76", spo2: "98%" }, diagnosis: "Viral fever", notes: "Hydration, rest, monitor fever", status: "completed" },
  { id: "consult-1002", appointmentId: "apt-phone-1002", patientId: "patient-ramesh", doctorId: "user-doctor-1", symptoms: "Routine BP review", vitals: { bp: "146/92", pulse: "82" }, diagnosis: "Hypertension review", notes: "Adjust medication if home readings remain high", status: "draft" }
];
