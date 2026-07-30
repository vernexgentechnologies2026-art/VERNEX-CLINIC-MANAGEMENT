import type { AppointmentRecord } from "../shared/types/domain";

// appointment.patientId, doctorId, clinicId, and branchId are required future foreign keys.
export const mockAppointments: AppointmentRecord[] = [
  { id: "apt-wa-1001", clinicId: "clinic-vernex", branchId: "branch-indiranagar", patientId: "patient-neha", doctorId: "user-doctor-1", tokenNumber: "WA014", date: "2026-07-09", time: "10:30 AM", department: "General Medicine", reason: "Fever and throat pain for two days", source: "whatsapp", status: "waiting", paymentStatus: "pending" },
  { id: "apt-phone-1002", clinicId: "clinic-vernex", branchId: "branch-indiranagar", patientId: "patient-ramesh", doctorId: "user-doctor-1", tokenNumber: "A012", date: "2026-07-09", time: "11:00 AM", department: "General Medicine", reason: "BP review", source: "phone", status: "in_consultation", paymentStatus: "partial" },
  { id: "apt-wa-2001", clinicId: "clinic-small", branchId: "branch-anna-nagar", patientId: "patient-ananya", doctorId: "user-doctor-owner", tokenNumber: "WA015", date: "2026-07-09", time: "12:00 PM", department: "Dermatology", reason: "Acne flare-up and skin irritation", source: "whatsapp", status: "booked", paymentStatus: "pending" }
];
