import type { Appointment, BillingShortcut, DoctorOption, QueueItem, ReceptionStats, ServiceOption, TimeSlot } from "./types";

export const doctors: DoctorOption[] = [
  { id: "d1", name: "Dr. Priya Sharma", specialization: "General Medicine", available: true },
  { id: "d2", name: "Dr. Rohan Mehta", specialization: "Dental", available: true },
  { id: "d3", name: "Dr. Aisha Khan", specialization: "Dermatology", available: true },
  { id: "d4", name: "Dr. Nikhil Rao", specialization: "Physiotherapy", available: false }
];

export const services: ServiceOption[] = [
  { id: "s1", name: "General Consultation", amount: 600, duration: "15 min" },
  { id: "s2", name: "Dental Checkup", amount: 800, duration: "20 min" },
  { id: "s3", name: "Skin Consultation", amount: 900, duration: "20 min" },
  { id: "s4", name: "Hair Treatment Consultation", amount: 1200, duration: "25 min" },
  { id: "s5", name: "Pediatric Consultation", amount: 700, duration: "20 min" },
  { id: "s6", name: "Physiotherapy Session", amount: 1100, duration: "30 min" }
];

export const timeSlots: TimeSlot[] = ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:30 PM", "03:00 PM", "04:30 PM"].map((label, i) => ({ id: `ts${i}`, label, available: i !== 2 }));

export const appointments: Appointment[] = [
  { id: "a1", token: "A009", patientId: "P-1024", patientName: "Neha Iyer", phone: "+91 98765 43210", age: 31, gender: "female", doctorId: "d1", doctorName: "Dr. Priya Sharma", service: "General Consultation", date: "2026-07-01", time: "09:30 AM", source: "whatsapp", status: "waiting", paymentStatus: "pending", notes: "Fever and throat pain" },
  { id: "a2", token: "A010", patientId: "P-1025", patientName: "Arjun Nair", phone: "+91 99887 77665", age: 44, gender: "male", doctorId: "d2", doctorName: "Dr. Rohan Mehta", service: "Dental Checkup", date: "2026-07-01", time: "10:00 AM", source: "walk_in", status: "in_consultation", paymentStatus: "pending", notes: "Tooth pain" },
  { id: "a3", token: "A011", patientId: "P-1026", patientName: "Fatima Shaikh", phone: "+91 91234 56780", age: 27, gender: "female", doctorId: "d3", doctorName: "Dr. Aisha Khan", service: "Skin Consultation", date: "2026-07-01", time: "10:30 AM", source: "qr_booking", status: "booked", paymentStatus: "paid" },
  { id: "a4", token: "A012", patientId: "P-1027", patientName: "Ramesh Gupta", phone: "+91 90000 11122", age: 62, gender: "male", doctorId: "d1", doctorName: "Dr. Priya Sharma", service: "General Consultation", date: "2026-07-01", time: "11:00 AM", source: "phone_call", status: "arrived", paymentStatus: "partial" },
  { id: "a5", token: "A013", patientId: "P-1028", patientName: "Meera Patel", phone: "+91 98888 22110", age: 8, gender: "female", doctorId: "d1", doctorName: "Dr. Priya Sharma", service: "Pediatric Consultation", date: "2026-07-01", time: "11:30 AM", source: "website", status: "cancelled", paymentStatus: "pending" },
  { id: "a6", token: "A014", patientId: "P-1029", patientName: "Karthik Menon", phone: "+91 97777 88990", age: 36, gender: "male", doctorId: "d4", doctorName: "Dr. Nikhil Rao", service: "Physiotherapy Session", date: "2026-07-01", time: "02:30 PM", source: "whatsapp", status: "completed", paymentStatus: "pending" }
];

export const queueItems: QueueItem[] = [
  { id: "q1", token: "A009", patientName: "Neha Iyer", age: 31, gender: "female", doctorName: "Dr. Priya Sharma", service: "General Consultation", reason: "Fever and throat pain", arrivalTime: "09:18 AM", waitingMinutes: 18, status: "waiting" },
  { id: "q2", token: "A010", patientName: "Arjun Nair", age: 44, gender: "male", doctorName: "Dr. Rohan Mehta", service: "Dental Checkup", reason: "Tooth pain", arrivalTime: "09:45 AM", waitingMinutes: 8, status: "in_consultation" },
  { id: "q3", token: "A012", patientName: "Ramesh Gupta", age: 62, gender: "male", doctorName: "Dr. Priya Sharma", service: "General Consultation", reason: "BP review", arrivalTime: "10:02 AM", waitingMinutes: 4, status: "arrived" },
  { id: "q4", token: "A014", patientName: "Karthik Menon", age: 36, gender: "male", doctorName: "Dr. Nikhil Rao", service: "Physiotherapy Session", reason: "Lower back pain", arrivalTime: "08:55 AM", waitingMinutes: 0, status: "completed" }
];

export const pendingBills: BillingShortcut[] = [
  { id: "b1", patientName: "Arjun Nair", service: "Dental Checkup", amount: 800, discount: 0, paymentMode: "upi", paymentStatus: "pending", doctorName: "Dr. Rohan Mehta", completedAt: "10:28 AM" },
  { id: "b2", patientName: "Karthik Menon", service: "Physiotherapy Session", amount: 1100, discount: 100, paymentMode: "cash", paymentStatus: "pending", doctorName: "Dr. Nikhil Rao", completedAt: "09:40 AM" },
  { id: "b3", patientName: "Ramesh Gupta", service: "General Consultation", amount: 600, discount: 0, paymentMode: "card", paymentStatus: "partial", doctorName: "Dr. Priya Sharma", completedAt: "10:10 AM" }
];

export const receptionStats: ReceptionStats = {
  todayAppointments: 38,
  waitingPatients: 6,
  inConsultation: 2,
  completed: 18,
  cancelledNoShow: 3,
  pendingBills: pendingBills.length,
  activeDoctors: doctors.filter((d) => d.available).length
};
