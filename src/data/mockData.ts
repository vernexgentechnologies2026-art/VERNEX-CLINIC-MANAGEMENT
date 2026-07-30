import type { Appointment } from "../types/appointment";
import type { Clinic, Doctor } from "../types/clinic";
import type { Medicine } from "../types/pharmacy";
import type { Patient } from "../types/patient";
import type { Payment } from "../types/billing";
import type { Prescription } from "../types/prescription";

export const clinic: Clinic = { id: "cl-1", name: "Vernex Multispeciality Clinic", slug: "vernex-clinic", specialization: "Dental, Dermatology & General Medicine", address: "12, 5th Main Road, Indiranagar, Bengaluru", phone: "+91 98765 43210", hours: "Mon–Sat · 9:00 AM–8:00 PM" };
export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Ananya Rao", specialization: "Dental Surgeon", qualification: "BDS, MDS", experience: 11, available: true },
  { id: "d2", name: "Dr. Vikram Shah", specialization: "Dermatologist", qualification: "MBBS, MD", experience: 14, available: true },
  { id: "d3", name: "Dr. Neha Iyer", specialization: "General Physician", qualification: "MBBS, DNB", experience: 8, available: false }
];
export const patients: Patient[] = [
  { id: "p1", name: "Aarav Mehta", phone: "+91 99876 54120", age: 34, gender: "Male", bloodGroup: "B+", lastVisit: "12 Jun 2026", visits: 4 },
  { id: "p2", name: "Meera Krishnan", phone: "+91 98450 22331", age: 28, gender: "Female", bloodGroup: "O+", lastVisit: "New patient", visits: 0 },
  { id: "p3", name: "Rohan Kapoor", phone: "+91 98111 47522", age: 42, gender: "Male", lastVisit: "18 Apr 2026", visits: 7 },
  { id: "p4", name: "Sana Sheikh", phone: "+91 97020 11884", age: 31, gender: "Female", lastVisit: "05 May 2026", visits: 2 }
];
export const appointments: Appointment[] = [
  { id: "a1", token: 12, patientId: "p1", patientName: "Aarav Mehta", doctorId: "d1", doctorName: "Dr. Ananya Rao", time: "10:15 AM", date: "2026-07-01", status: "waiting", reason: "Tooth sensitivity", waitingMinutes: 18 },
  { id: "a2", token: 13, patientId: "p2", patientName: "Meera Krishnan", doctorId: "d2", doctorName: "Dr. Vikram Shah", time: "10:30 AM", date: "2026-07-01", status: "arrived", reason: "Skin rash", waitingMinutes: 8 },
  { id: "a3", token: 14, patientId: "p3", patientName: "Rohan Kapoor", doctorId: "d3", doctorName: "Dr. Neha Iyer", time: "10:45 AM", date: "2026-07-01", status: "booked", reason: "Annual health review" },
  { id: "a4", token: 10, patientId: "p4", patientName: "Sana Sheikh", doctorId: "d1", doctorName: "Dr. Ananya Rao", time: "9:45 AM", date: "2026-07-01", status: "completed", reason: "Dental follow-up" }
];
export const medicines: Medicine[] = [
  { id: "m1", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 8, reorderLevel: 20, expiry: "Sep 2026", price: 142 },
  { id: "m2", name: "Paracetamol 650mg", category: "Analgesic", stock: 14, reorderLevel: 25, expiry: "Jan 2027", price: 35 },
  { id: "m3", name: "Cetirizine 10mg", category: "Antihistamine", stock: 11, reorderLevel: 15, expiry: "Nov 2026", price: 54 }
];
export const prescriptions: Prescription[] = [
  { id: "RX-1042", patientName: "Aarav Mehta", doctorName: "Dr. Ananya Rao", createdAt: "10:22 AM", status: "pending", items: [{ medicineId: "m1", medicineName: "Amoxicillin 500mg", dosage: "1 tablet", frequency: "Twice daily", duration: "5 days" }] },
  { id: "RX-1041", patientName: "Sana Sheikh", doctorName: "Dr. Ananya Rao", createdAt: "9:58 AM", status: "pending", items: [{ medicineId: "m2", medicineName: "Paracetamol 650mg", dosage: "1 tablet", frequency: "After food", duration: "3 days" }] }
];
export const payments: Payment[] = [
  { id: "INV-2351", patientName: "Sana Sheikh", amount: 1200, mode: "UPI", status: "paid", time: "10:04 AM" },
  { id: "INV-2350", patientName: "Kabir Nair", amount: 850, mode: "Cash", status: "paid", time: "9:42 AM" },
  { id: "INV-2349", patientName: "Diya Patel", amount: 2400, mode: "Card", status: "pending", time: "Yesterday" }
];
export const revenueTrend = [
  { day: "Mon", revenue: 28400 }, { day: "Tue", revenue: 32100 }, { day: "Wed", revenue: 29800 },
  { day: "Thu", revenue: 38400 }, { day: "Fri", revenue: 41600 }, { day: "Sat", revenue: 47200 }, { day: "Sun", revenue: 35400 }
];
export const appointmentMix = [
  { name: "Completed", value: 18, fill: "#13969c" }, { name: "Waiting", value: 6, fill: "#f59e0b" },
  { name: "Booked", value: 11, fill: "#3b82f6" }, { name: "Cancelled", value: 3, fill: "#cbd5e1" }
];
export const doctorRevenue = [
  { name: "Dr. Rao", value: 42600 }, { name: "Dr. Shah", value: 38100 }, { name: "Dr. Iyer", value: 29400 }
];
