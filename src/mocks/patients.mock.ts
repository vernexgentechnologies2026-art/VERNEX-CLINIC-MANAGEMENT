import type { PatientRecord } from "../shared/types/domain";

// patient.id is referenced by appointments, consultations, prescriptions, invoices, WhatsApp conversations, and reminders.
export const mockPatients: PatientRecord[] = [
  { id: "patient-neha", patientId: "VNX-P-1001", clinicId: "clinic-vernex", branchId: "branch-indiranagar", fullName: "Neha Iyer", phone: "+91 98765 43210", whatsappNumber: "+91 98765 43210", age: 31, gender: "female", source: "whatsapp", allergies: ["Penicillin"], medicalHistory: ["Seasonal allergy"], currentMedications: ["Cetirizine SOS"], whatsappConsent: true, reminderConsent: true },
  { id: "patient-ramesh", patientId: "VNX-P-1002", clinicId: "clinic-vernex", branchId: "branch-indiranagar", fullName: "Ramesh Gupta", phone: "+91 90000 11122", whatsappNumber: "+91 90000 11122", age: 62, gender: "male", source: "phone", allergies: [], medicalHistory: ["Hypertension", "Diabetes"], currentMedications: ["Telmisartan", "Metformin"], whatsappConsent: true, reminderConsent: true },
  { id: "patient-ananya", patientId: "KSH-P-2001", clinicId: "clinic-small", branchId: "branch-anna-nagar", fullName: "Ananya Rao", phone: "+91 99887 77665", whatsappNumber: "+91 99887 77665", age: 26, gender: "female", source: "whatsapp", allergies: [], medicalHistory: ["Acne flare-up"], currentMedications: [], whatsappConsent: true, reminderConsent: false }
];
