import type { WhatsAppBookingSettings, WhatsAppBookingSimulation, WhatsAppBookingStats, WhatsAppConversation, WhatsAppFlowStep, WhatsAppTemplate } from "./types";

export const whatsappStats: WhatsAppBookingStats = { bookingRequests: 42, appointmentsConfirmed: 31, pendingConversations: 7, remindersScheduled: 26, failedMessages: 2, templatesActive: 9 };
export const flowSteps: WhatsAppFlowStep[] = [
  { id: "f1", title: "Patient sends ‘Hi’", description: "The patient starts from WhatsApp, QR, or a public booking link.", sampleMessage: "Hi" },
  { id: "f2", title: "Bot welcomes patient", description: "Clinic options are shown clearly.", sampleMessage: "Welcome to Vernex Clinic. Please choose an option." },
  { id: "f3", title: "Patient selects Book Appointment", description: "Booking path begins without opening the website.", sampleMessage: "1. Book Appointment" },
  { id: "f4", title: "Doctor / service selection", description: "Patient chooses doctor or service from simple options.", sampleMessage: "Dr. Priya Sharma — General Consultation" },
  { id: "f5", title: "Date and slot selection", description: "Available dates and slots are shown.", sampleMessage: "Tomorrow · 10:30 AM" },
  { id: "f6", title: "Patient details", description: "Name, age, phone and visit reason are collected.", sampleMessage: "Neha Iyer, 31, fever" },
  { id: "f7", title: "Appointment confirmed", description: "Token and reminder are sent.", sampleMessage: "Token A014. Please arrive 10 minutes early." }
];

export const templates: WhatsAppTemplate[] = [
  ["Welcome Message", "booking", "active", "Welcome to {{clinic_name}}. Please choose: 1. Book Appointment 2. View Appointment 3. Talk to Reception"],
  ["Book Appointment Option", "booking", "active", "Great. Let’s book your appointment. Please choose a doctor or service."],
  ["Doctor Selection Message", "booking", "active", "Please choose a doctor: {{doctor_options}}"],
  ["Service Selection Message", "booking", "active", "Please choose a service: {{service_options}}"],
  ["Date Selection Message", "booking", "active", "Please choose appointment date: Today / Tomorrow / Choose another date"],
  ["Slot Selection Message", "booking", "needs_api_approval", "Available slots: {{slot_options}}"],
  ["Patient Details Request", "booking", "active", "Please share patient name, age, gender and reason for visit."],
  ["Appointment Confirmation", "booking", "active", "Your appointment is confirmed. Token: {{token_number}}. Doctor: {{doctor_name}} at {{appointment_time}}."],
  ["Appointment Reminder", "reminder", "active", "Reminder: Your appointment at {{clinic_name}} is scheduled at {{appointment_time}}."],
  ["Follow-up Reminder", "follow_up", "draft", "Your follow-up with {{doctor_name}} is due on {{appointment_date}}."],
  ["Cancellation Message", "cancellation", "active", "Your appointment has been cancelled. Reply Hi to book again."],
  ["Payment Link Message", "payment", "disabled", "Please complete payment using {{payment_link}}."],
  ["Review Request Message", "review", "draft", "Thanks for visiting {{clinic_name}}. Please share your feedback."]
].map(([name, category, status, previewText], i) => ({ id: `tpl-${i + 1}`, name, category: category as WhatsAppTemplate["category"], status: status as WhatsAppTemplate["status"], previewText, variables: ["{{patient_name}}", "{{doctor_name}}", "{{appointment_date}}", "{{appointment_time}}", "{{token_number}}", "{{clinic_name}}", "{{payment_link}}"], lastUpdated: i < 5 ? "1 Jul 2026" : "28 Jun 2026" }));

const baseMessages = [
  { id: "m1", sender: "patient" as const, text: "Hi", time: "10:21 AM" },
  { id: "m2", sender: "bot" as const, text: "Welcome to Vernex Clinic. Please choose: 1. Book Appointment 2. View Appointment 3. Talk to Reception", time: "10:21 AM" },
  { id: "m3", sender: "patient" as const, text: "Book Appointment", time: "10:22 AM" },
  { id: "m4", sender: "bot" as const, text: "Please choose a doctor or service.", time: "10:22 AM" }
];
export const conversations: WhatsAppConversation[] = [
  { id: "c1", patientName: "Neha Iyer", phone: "+91 98765 43210", lastMessage: "Token A014 confirmed. Thank you.", currentStep: "Appointment confirmed", status: "appointment_confirmed", source: "whatsapp", appointmentToken: "A014", lastUpdated: "10:31 AM", messages: [...baseMessages, { id: "m5", sender: "bot", text: "Your appointment is confirmed. Token: A014. Please arrive 10 minutes early.", time: "10:30 AM" }], bookingSummary: { token: "A014", patientName: "Neha Iyer", doctorName: "Dr. Priya Sharma", service: "General Consultation", dateTime: "3 Jul · 10:30 AM" } },
  { id: "c2", phone: "+91 99887 77665", lastMessage: "Please choose a slot.", currentStep: "Slot selection", status: "waiting_for_patient", source: "qr", lastUpdated: "10:40 AM", messages: baseMessages },
  { id: "c3", patientName: "Ramesh Gupta", phone: "+91 90000 11122", lastMessage: "Transferred to reception.", currentStep: "Reception handoff", status: "transferred_to_reception", source: "whatsapp", lastUpdated: "09:58 AM", messages: [...baseMessages, { id: "m6", sender: "reception", text: "Reception handoff note: patient asked for staff.", time: "09:58 AM" }] },
  { id: "c4", patientName: "Fatima Shaikh", phone: "+91 91234 56780", lastMessage: "Message failed placeholder.", currentStep: "Retry needed", status: "failed", source: "website", lastUpdated: "09:20 AM", messages: [{ id: "m7", sender: "bot", text: "Failed message placeholder. Retry after API integration.", time: "09:20 AM" }] }
];

export const simulation: WhatsAppBookingSimulation = { selectedClinic: "Vernex Multispeciality Clinic", selectedDoctor: "Dr. Priya Sharma", selectedService: "General Consultation", selectedSlot: "10:30 AM", patientDetails: "Neha Iyer · 31 · Female · Fever", messages: [
  { id: "s1", sender: "patient", text: "Hi", time: "Now" },
  { id: "s2", sender: "bot", text: "Welcome to Vernex Clinic OS. How can we help you? 1. Book Appointment 2. View Appointment 3. Talk to Reception", time: "Now" },
  { id: "s3", sender: "patient", text: "Book Appointment", time: "Now" },
  { id: "s4", sender: "bot", text: "Please choose a doctor or service: Dr. Priya Sharma — General Consultation, Dr. Arjun Mehta — Dental Checkup, Dr. Kavya Nair — Skin Consultation, Dr. Ramesh Kumar — Pediatric Consultation", time: "Now" },
  { id: "s5", sender: "bot", text: "Choose date: Today, Tomorrow, Choose another date. Then choose slot: 10:00 AM, 10:30 AM, 11:00 AM, 05:00 PM.", time: "Now" },
  { id: "s6", sender: "bot", text: "Your appointment is confirmed. Token: A014. Doctor: Dr. Priya Sharma. Time: 10:30 AM. Please arrive 10 minutes early.", time: "Now" }
] };

export const settings: WhatsAppBookingSettings = { businessNumber: "+91 98765 43210", displayName: "Vernex Clinic", businessProfileStatus: "Demo profile · Not verified", enableBooking: true, allowExistingPatientLookup: true, requirePaymentBeforeConfirmation: false, autoCreateAppointment: true, sendReminderBeforeAppointment: true, reminderTiming: "2 hours before", reminderTemplate: "Appointment Reminder", followUpReminder: true, handoffOnStaff: true, handoffAfterFailedAttempts: true, receptionContactDisplay: "+91 98765 43210", apiStatus: "not_connected", provider: "meta_cloud_api" };
