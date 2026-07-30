import type { DoctorAvailabilityRecord } from "../shared/types/domain";

// Availability drives appointment slot selection in reception, doctor, and WhatsApp booking workflows.
export const mockDoctorAvailability: DoctorAvailabilityRecord[] = [
  { id: "avail-priya-mon", doctorId: "user-doctor-1", branchId: "branch-indiranagar", weekday: "Monday-Friday", startTime: "09:30", endTime: "17:30", slotDurationMinutes: 15, blockedDates: ["2026-07-16"] },
  { id: "avail-kavya-week", doctorId: "user-doctor-owner", branchId: "branch-anna-nagar", weekday: "Monday-Saturday", startTime: "10:00", endTime: "18:00", slotDurationMinutes: 20, blockedDates: [] }
];
