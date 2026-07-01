import type { FamilyMember, MedicineReminder, PatientAppointment, PatientBill, PatientDashboardSummary, PatientFollowUp, PatientPortalProfile, PatientPrescription } from "./types";

export const patientProfile: PatientPortalProfile = {
  id: "pat-1",
  name: "Ananya Rao",
  age: 29,
  gender: "female",
  phone: "+91 98765 43210",
  email: "ananya.rao@example.com",
  address: "Indiranagar, Bengaluru",
  emergencyContact: "Rohit Rao, +91 99887 77665",
  bloodGroup: "B+",
  allergies: ["Dust allergy"],
  existingConditions: ["Mild asthma"],
  currentMedications: ["Vitamin D"]
};

export const patientAppointments: PatientAppointment[] = [
  { id: "appt-1", doctorName: "Dr. Priya Sharma", service: "General Consultation", dateTime: "3 Jul 2026, 10:30 AM", tokenNumber: "A014", source: "whatsapp", status: "confirmed", clinicName: "Vernex Multispeciality Clinic", clinicAddress: "12, MG Road, Bengaluru" },
  { id: "appt-2", doctorName: "Dr. Kavya Nair", service: "Skin Consultation", dateTime: "12 Jul 2026, 05:00 PM", tokenNumber: "D022", source: "follow_up", status: "booked", clinicName: "Vernex Multispeciality Clinic", clinicAddress: "12, MG Road, Bengaluru" },
  { id: "appt-3", doctorName: "Dr. Arjun Mehta", service: "Dental Checkup", dateTime: "18 Jun 2026, 11:00 AM", tokenNumber: "B009", source: "reception", status: "completed", clinicName: "Vernex Multispeciality Clinic", clinicAddress: "12, MG Road, Bengaluru" },
  { id: "appt-4", doctorName: "Dr. Ramesh Kumar", service: "Pediatric Consultation", dateTime: "5 Jun 2026, 09:30 AM", tokenNumber: "P004", source: "website", status: "cancelled", clinicName: "Vernex Multispeciality Clinic", clinicAddress: "12, MG Road, Bengaluru" }
];

export const patientPrescriptions: PatientPrescription[] = [
  {
    id: "rx-1",
    date: "18 Jun 2026",
    doctorName: "Dr. Priya Sharma",
    patientName: "Ananya Rao",
    diagnosis: "Seasonal fever with throat irritation",
    status: "active",
    medicines: [
      { medicineName: "Paracetamol 650", dosage: "1 tablet", frequency: "Twice daily", timing: "Morning and night", duration: "3 days", instructions: "After food" },
      { medicineName: "Cetirizine 10", dosage: "1 tablet", frequency: "Once daily", timing: "Night", duration: "5 days", instructions: "May cause sleepiness" },
      { medicineName: "Warm saline gargle", dosage: "As advised", frequency: "Twice daily", timing: "Morning and evening", duration: "5 days", instructions: "Use warm water" }
    ],
    advice: ["Drink warm fluids", "Rest well", "Return if fever continues beyond 3 days"],
    labTests: ["CBC if fever persists"],
    followUpDate: "3 Jul 2026"
  },
  {
    id: "rx-2",
    date: "22 May 2026",
    doctorName: "Dr. Arjun Mehta",
    patientName: "Ananya Rao",
    diagnosis: "Routine dental checkup",
    status: "completed",
    medicines: [{ medicineName: "Chlorhexidine mouthwash", dosage: "10 ml", frequency: "Twice daily", timing: "After brushing", duration: "7 days", instructions: "Do not swallow" }],
    advice: ["Brush twice daily", "Schedule cleaning in 6 months"],
    labTests: []
  }
];

export const patientBills: PatientBill[] = [
  { id: "bill-1", billNumber: "BILL-1048", receiptNumber: "RCPT-1048", billType: "consultation", date: "18 Jun 2026", items: [{ name: "General consultation", amount: 600 }, { name: "Nebulization", amount: 250 }], totalAmount: 850, paidAmount: 500, balance: 350, status: "partial", paymentMode: "upi" },
  { id: "bill-2", billNumber: "BILL-1017", receiptNumber: "RCPT-1017", billType: "pharmacy", date: "22 May 2026", items: [{ name: "Medicines", amount: 420 }], totalAmount: 420, paidAmount: 420, balance: 0, status: "paid", paymentMode: "cash" }
];

export const patientFollowUps: PatientFollowUp[] = [
  { id: "fu-1", doctorName: "Dr. Priya Sharma", reason: "Fever review", previousDiagnosis: "Seasonal fever", followUpDate: "3 Jul 2026", status: "due_today", reminderStatus: "sent" },
  { id: "fu-2", doctorName: "Dr. Kavya Nair", reason: "Skin irritation review", previousDiagnosis: "Dermatitis", followUpDate: "12 Jul 2026", status: "upcoming", reminderStatus: "not_sent" },
  { id: "fu-3", doctorName: "Dr. Arjun Mehta", reason: "Dental cleaning", previousDiagnosis: "Plaque buildup", followUpDate: "20 Jun 2026", status: "overdue", reminderStatus: "sent" }
];

export const medicineReminders: MedicineReminder[] = [
  { id: "med-1", medicineName: "Paracetamol 650", dosage: "1 tablet", timeOfDay: "morning", timing: "8:00 AM", foodTiming: "after_food", duration: "3 days", startDate: "1 Jul 2026", endDate: "3 Jul 2026", status: "taken", prescriptionId: "rx-1" },
  { id: "med-2", medicineName: "Cetirizine 10", dosage: "1 tablet", timeOfDay: "night", timing: "9:00 PM", foodTiming: "after_food", duration: "5 days", startDate: "1 Jul 2026", endDate: "5 Jul 2026", status: "pending", prescriptionId: "rx-1" },
  { id: "med-3", medicineName: "Warm saline gargle", dosage: "As advised", timeOfDay: "evening", timing: "6:30 PM", foodTiming: "after_food", duration: "5 days", startDate: "1 Jul 2026", endDate: "5 Jul 2026", status: "snoozed", prescriptionId: "rx-1" }
];

export const familyMembers: FamilyMember[] = [
  { id: "fam-1", name: "Rohit Rao", relation: "Husband", age: 32, gender: "Male", lastVisit: "12 May 2026", activePrescriptions: 0 },
  { id: "fam-2", name: "Meera Rao", relation: "Mother", age: 58, gender: "Female", lastVisit: "8 Jun 2026", activePrescriptions: 1 }
];

export const dashboardSummary: PatientDashboardSummary = {
  upcomingAppointments: 2,
  activePrescriptions: 1,
  pendingBills: 1,
  followUpsDue: 1,
  medicineRemindersToday: 3
};
