import type { DoctorQueueItem, DoctorStats, FollowUp, LabTest, Medicine, PatientProfile, PatientTimelineItem, Prescription, PrescriptionTemplate } from "./types";

export const doctorName = "Dr. Priya Sharma";
export const doctorStats: DoctorStats = { waitingPatients: 7, inConsultation: 1, completedToday: 14, followUpsDue: 5, averageWaitingTime: 16, prescriptionsSent: 12 };
export const doctorQueue: DoctorQueueItem[] = [
  { id: "q1", token: "A009", patientId: "p1", patientName: "Neha Iyer", age: 31, gender: "female", reason: "Fever and throat pain", source: "WhatsApp", waitingMinutes: 18, previousVisit: true, tags: ["Regular"], status: "waiting" },
  { id: "q2", token: "A012", patientId: "p2", patientName: "Ramesh Gupta", age: 62, gender: "male", reason: "BP review", source: "Phone call", waitingMinutes: 11, previousVisit: true, tags: ["Senior Citizen", "Follow-up"], status: "in_consultation" },
  { id: "q3", token: "A015", patientId: "p3", patientName: "Meera Patel", age: 8, gender: "female", reason: "Cough and mild fever", source: "Walk-in", waitingMinutes: 7, previousVisit: false, tags: ["Child", "New Patient"], status: "waiting" },
  { id: "q4", token: "A018", patientId: "p4", patientName: "Kavya Reddy", age: 28, gender: "female", reason: "Skin allergy follow-up", source: "QR booking", waitingMinutes: 0, previousVisit: true, tags: ["VIP", "Follow-up"], status: "completed" }
];
export const patientProfiles: PatientProfile[] = [
  { id: "p1", name: "Neha Iyer", phone: "+91 98765 43210", age: 31, gender: "Female", bloodGroup: "B+", tags: ["Regular"], lastVisit: "18 Jun 2026", allergies: ["Penicillin"], conditions: ["Seasonal allergy"], medications: ["Cetirizine SOS"], emergencyContact: "Amit Iyer · +91 90000 12345", totalVisits: 8, pendingPayment: false, internalNotes: "Prefers WhatsApp prescription." },
  { id: "p2", name: "Ramesh Gupta", phone: "+91 90000 11122", age: 62, gender: "Male", bloodGroup: "O+", tags: ["Senior Citizen", "Follow-up"], lastVisit: "20 Jun 2026", allergies: ["None recorded"], conditions: ["Hypertension", "Diabetes"], medications: ["Telmisartan", "Metformin"], emergencyContact: "Suman Gupta · +91 98888 77889", totalVisits: 21, pendingPayment: true, internalNotes: "Check BP readings each visit." }
];
export const timeline: PatientTimelineItem[] = [
  { id: "v1", date: "18 Jun 2026", doctor: doctorName, diagnosis: "Viral fever", prescriptionSummary: "3 medicines · 3 days", followUpStatus: "Completed", paymentStatus: "Paid" },
  { id: "v2", date: "02 May 2026", doctor: doctorName, diagnosis: "Allergic rhinitis", prescriptionSummary: "2 medicines · SOS", followUpStatus: "Not required", paymentStatus: "Paid" },
  { id: "v3", date: "14 Mar 2026", doctor: "Dr. Aisha Khan", diagnosis: "Skin rash", prescriptionSummary: "Cream + antihistamine", followUpStatus: "Due today", paymentStatus: "Pending" }
];
export const favoriteMedicines: Medicine[] = ["Paracetamol 500mg", "Amoxicillin 500mg", "Cetirizine 10mg", "Pantoprazole 40mg", "Vitamin D3", "ORS"].map((name, i) => ({ id: `m${i}`, name, form: i < 4 ? "Tablet" : "Sachet" }));
const med = (id: string, medicineName: string, dosage = "1 tablet", frequency = "1-0-1", timing = "After food", duration = "3 days") => ({ id, medicineName, dosage, frequency, timing, duration, instructions: "", quantity: "" });
export const prescriptionTemplates: PrescriptionTemplate[] = [
  { id: "t1", name: "Fever", medicines: [med("rx1", "Paracetamol 500mg"), med("rx2", "ORS", "1 sachet", "0-1-0", "After food", "2 days")], advice: "Hydration, rest, monitor fever." },
  { id: "t2", name: "Cold & Cough", medicines: [med("rx3", "Cetirizine 10mg", "1 tablet", "0-0-1", "After food", "5 days")], advice: "Steam inhalation twice daily." },
  { id: "t3", name: "Skin Allergy", medicines: [med("rx4", "Cetirizine 10mg", "1 tablet", "0-0-1", "After food", "5 days")], advice: "Avoid suspected trigger." },
  { id: "t4", name: "Dental Pain", medicines: [med("rx5", "Amoxicillin 500mg", "1 capsule", "1-0-1", "After food", "5 days")], advice: "Dental review if pain persists." },
  { id: "t5", name: "Hair Treatment Follow-up", medicines: [med("rx6", "Vitamin D3", "1 tablet", "0-0-1", "After food", "30 days")], advice: "Follow hair care routine." },
  { id: "t6", name: "Pediatric Fever", medicines: [med("rx7", "Paracetamol syrup", "5 ml", "1-1-1", "After food", "3 days")], advice: "Dose per weight, sponge if high fever." },
  { id: "t7", name: "Physiotherapy Pain Management", medicines: [med("rx8", "Pantoprazole 40mg", "1 tablet", "1-0-0", "Before food", "5 days")], advice: "Heat therapy and guided stretching." }
];
export const labTests: LabTest[] = ["CBC", "Blood Sugar", "Thyroid Profile", "Vitamin D", "X-Ray", "Skin Patch Test", "Dental X-Ray"].map((name, i) => ({ id: `l${i}`, name }));
export const prescriptions: Prescription[] = [{ id: "pRx1", patientId: "p1", doctorName, diagnosis: "Viral fever", date: "18 Jun 2026", items: [med("i1", "Paracetamol 500mg")], advice: "Rest and fluids", labTests: ["CBC"], followUpDate: "25 Jun 2026" }];
export const followUps: FollowUp[] = [
  { id: "f1", patientId: "p1", patientName: "Neha Iyer", phone: "+91 98765 43210", lastDiagnosis: "Viral fever", followUpDate: "2026-07-01", reason: "Check fever trend", status: "due_today", reminderStatus: "WhatsApp draft ready" },
  { id: "f2", patientId: "p2", patientName: "Ramesh Gupta", phone: "+91 90000 11122", lastDiagnosis: "Hypertension", followUpDate: "2026-06-29", reason: "BP review", status: "overdue", reminderStatus: "Reminder pending" },
  { id: "f3", patientId: "p4", patientName: "Kavya Reddy", phone: "+91 98877 44556", lastDiagnosis: "Skin allergy", followUpDate: "2026-07-04", reason: "Review rash", status: "upcoming", reminderStatus: "Scheduled" }
];
