export type PatientAppointmentStatus = "booked" | "confirmed" | "arrived" | "completed" | "cancelled" | "no_show";
export type PatientBillStatus = "paid" | "pending" | "partial";
export type PatientFollowUpStatus = "due_today" | "upcoming" | "overdue" | "completed";
export type MedicineReminderStatus = "pending" | "taken" | "missed" | "snoozed";

export type PatientPortalProfile = {
  id: string;
  name: string;
  age: number;
  gender: "female" | "male" | "other";
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
};

export type PatientAppointment = {
  id: string;
  doctorName: string;
  service: string;
  dateTime: string;
  tokenNumber: string;
  source: "website" | "whatsapp" | "reception" | "follow_up";
  status: PatientAppointmentStatus;
  clinicName: string;
  clinicAddress: string;
};

export type PatientPrescriptionItem = {
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
};

export type PatientPrescription = {
  id: string;
  date: string;
  doctorName: string;
  patientName: string;
  diagnosis: string;
  status: "active" | "completed";
  medicines: PatientPrescriptionItem[];
  advice: string[];
  labTests: string[];
  followUpDate?: string;
};

export type PatientBill = {
  id: string;
  billNumber: string;
  receiptNumber: string;
  billType: "consultation" | "pharmacy" | "lab" | "package";
  date: string;
  items: { name: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: PatientBillStatus;
  paymentMode: "cash" | "upi" | "card" | "online" | "pending";
};

export type PatientFollowUp = {
  id: string;
  doctorName: string;
  reason: string;
  previousDiagnosis: string;
  followUpDate: string;
  status: PatientFollowUpStatus;
  reminderStatus: "not_sent" | "sent" | "acknowledged";
};

export type MedicineReminder = {
  id: string;
  medicineName: string;
  dosage: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  timing: string;
  foodTiming: "before_food" | "after_food";
  duration: string;
  startDate: string;
  endDate: string;
  status: MedicineReminderStatus;
  prescriptionId: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  lastVisit: string;
  activePrescriptions: number;
};

export type PatientDashboardSummary = {
  upcomingAppointments: number;
  activePrescriptions: number;
  pendingBills: number;
  followUpsDue: number;
  medicineRemindersToday: number;
};
