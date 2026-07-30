import type { AvailableDate, AvailableSlot, BookingDoctor, BookingService, BookingStatusResult, ClinicBookingProfile } from "./types";

export const clinicProfile: ClinicBookingProfile = {
  id: "cl-1",
  slug: "vernex-clinic",
  name: "Vernex Multispeciality Clinic",
  specialization: "General · Dental · Skin · Pediatric · Physiotherapy",
  address: "12, 5th Main Road, Indiranagar, Bengaluru",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  hours: "Mon–Sat · 9:00 AM–8:00 PM",
  mapUrl: "#",
  bookingUrl: "vernex.in/book/vernex-clinic"
};

export const bookingDoctors: BookingDoctor[] = [
  { id: "d1", name: "Dr. Priya Sharma", specialization: "General Medicine", experience: 12, qualification: "MBBS, MD", availableToday: true, consultationFee: 600 },
  { id: "d2", name: "Dr. Rohan Mehta", specialization: "Dental Surgeon", experience: 9, qualification: "BDS, MDS", availableToday: true, consultationFee: 800 },
  { id: "d3", name: "Dr. Aisha Khan", specialization: "Dermatology", experience: 10, qualification: "MBBS, DDVL", availableToday: true, consultationFee: 900 },
  { id: "d4", name: "Dr. Nikhil Rao", specialization: "Physiotherapy", experience: 8, qualification: "MPT", availableToday: false, consultationFee: 1100 }
];

export const bookingServices: BookingService[] = [
  { id: "s1", name: "General Consultation", duration: "15 min", price: 600, description: "Fever, pain, infection, BP/diabetes review, general concerns." },
  { id: "s2", name: "Dental Checkup", duration: "20 min", price: 800, description: "Tooth pain, cleaning, dental review, gum concerns." },
  { id: "s3", name: "Skin Consultation", duration: "20 min", price: 900, description: "Rashes, allergy, acne, skin infection, pigmentation." },
  { id: "s4", name: "Hair Consultation", duration: "20 min", price: 1000, description: "Hair fall, dandruff, scalp care, treatment follow-up." },
  { id: "s5", name: "Pediatric Consultation", duration: "20 min", price: 700, description: "Child fever, cough, growth and routine pediatric care." },
  { id: "s6", name: "Physiotherapy Session", duration: "30 min", price: 1100, description: "Pain management, mobility, rehab and guided exercises." }
];

export const availableDates: AvailableDate[] = [
  { id: "dt1", label: "Today, 1 Jul", date: "2026-07-01", available: true },
  { id: "dt2", label: "Thu, 2 Jul", date: "2026-07-02", available: true },
  { id: "dt3", label: "Fri, 3 Jul", date: "2026-07-03", available: true },
  { id: "dt4", label: "Sat, 4 Jul", date: "2026-07-04", available: false },
  { id: "dt5", label: "Mon, 6 Jul", date: "2026-07-06", available: true }
];

export const availableSlots: AvailableSlot[] = [
  { id: "m1", label: "09:30 AM", period: "morning", status: "available" },
  { id: "m2", label: "10:00 AM", period: "morning", status: "limited" },
  { id: "m3", label: "10:30 AM", period: "morning", status: "booked" },
  { id: "a1", label: "02:30 PM", period: "afternoon", status: "available" },
  { id: "a2", label: "03:00 PM", period: "afternoon", status: "limited" },
  { id: "e1", label: "05:30 PM", period: "evening", status: "available" },
  { id: "e2", label: "06:00 PM", period: "evening", status: "available" }
];

export const mockBookingStatus: BookingStatusResult = { bookingId: "VNX-48219", token: "A014", status: "confirmed", clinicName: clinicProfile.name, doctorName: "Dr. Priya Sharma", patientName: "Neha Iyer", dateTime: "3 July 2026 · 10:30 AM" };
