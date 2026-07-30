import type { ClinicDepartment, ClinicMode, WhatsAppAvailability, WhatsAppBookingSettings, WhatsAppBookingSimulation, WhatsAppBookingStats, WhatsAppConfirmedAppointment, WhatsAppConversation, WhatsAppDoctor, WhatsAppFlowStep, WhatsAppTemplate } from "./types";

export const departmentLabel: Record<ClinicDepartment, string> = {
  dermatology: "Dermatology",
  orthopaedics: "Orthopaedics",
  dental: "Dental",
  pediatrics: "Pediatrics",
  general_medicine: "General Medicine",
  physiotherapy: "Physiotherapy",
  hair_clinic: "Hair Clinic",
  other: "Other"
};

export const clinicModes: { mode: ClinicMode; label: string; clinicName: string }[] = [
  { mode: "multi_speciality", label: "Multi-speciality", clinicName: "Vernex Multispeciality Clinic" },
  { mode: "single_speciality", label: "Single-speciality", clinicName: "Vernex Skin & Hair Clinic" }
];

export const departments = Object.keys(departmentLabel) as ClinicDepartment[];

export const whatsappDoctors: WhatsAppDoctor[] = [
  { id: "doc-priya", name: "Dr. Priya Sharma", qualification: "MBBS, MD", department: "general_medicine", specialisation: "General Medicine", consultationFee: 600, nextAvailableSlot: "Today 10:30 AM" },
  { id: "doc-kavya", name: "Dr. Kavya Nair", qualification: "MD Dermatology", department: "dermatology", specialisation: "Skin Allergy & Acne", consultationFee: 800, nextAvailableSlot: "Today 12:00 PM" },
  { id: "doc-arjun", name: "Dr. Arjun Mehta", qualification: "BDS, MDS", department: "dental", specialisation: "Dental Pain & Root Canal", consultationFee: 700, nextAvailableSlot: "Tomorrow 09:30 AM" },
  { id: "doc-ramesh", name: "Dr. Ramesh Kumar", qualification: "D.Ortho", department: "orthopaedics", specialisation: "Joint Pain", consultationFee: 900, nextAvailableSlot: "Today 05:00 PM" },
  { id: "doc-aisha", name: "Dr. Aisha Khan", qualification: "DCH", department: "pediatrics", specialisation: "Child Fever & Cough", consultationFee: 650, nextAvailableSlot: "Tomorrow 11:00 AM" },
  { id: "doc-rahul", name: "Dr. Rahul Menon", qualification: "MPT", department: "physiotherapy", specialisation: "Back Pain Rehab", consultationFee: 500, nextAvailableSlot: "Friday 04:00 PM" }
];

export const doctorAvailability: WhatsAppAvailability[] = whatsappDoctors.map((doctor, index) => ({
  doctorId: doctor.id,
  dates: [
    { date: "2026-07-09", label: "Today", slots: ["10:00 AM", "10:30 AM", "12:00 PM"].slice(0, 2 + (index % 2)) },
    { date: "2026-07-10", label: "Tomorrow", slots: ["09:30 AM", "11:00 AM", "05:00 PM"] },
    { date: "2026-07-11", label: "Saturday", slots: ["10:15 AM", "01:00 PM"] }
  ]
}));

export const confirmedWhatsappAppointment: WhatsAppConfirmedAppointment = {
  appointmentId: "WA-APT-1024",
  tokenNumber: "WA014",
  patientName: "Neha Iyer",
  phone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  age: 31,
  gender: "female",
  department: "general_medicine",
  doctorId: "doc-priya",
  doctorName: "Dr. Priya Sharma",
  appointmentDate: "2026-07-09",
  appointmentTime: "10:30 AM",
  mainProblem: "Fever and throat pain for two days",
  source: "whatsapp",
  status: "waiting",
  isNewPatient: false,
  reminderStatus: "Confirmation sent. Appointment reminder queued."
};

export const whatsappStats: WhatsAppBookingStats = { bookingRequests: 58, appointmentsConfirmed: 44, pendingConversations: 6, remindersScheduled: 39, failedMessages: 1, templatesActive: 10 };
export const flowSteps: WhatsAppFlowStep[] = [
  { id: "f1", title: "Patient sends Hi", description: "The patient starts from WhatsApp, QR, or the public booking link.", sampleMessage: "Hi" },
  { id: "f2", title: "Clinic mode decides the path", description: "Multi-speciality clinics ask for department first. Single-speciality clinics show simple actions.", sampleMessage: "What type of care do you need?" },
  { id: "f3", title: "Doctor, date, and slot", description: "Only available doctors and slots are shown.", sampleMessage: "Dr. Priya Sharma - Today 10:30 AM" },
  { id: "f4", title: "One question at a time", description: "Name, age, gender, problem, and new/existing patient status are collected.", sampleMessage: "What problem are you facing?" },
  { id: "f5", title: "Summary before confirmation", description: "Patient confirms before the appointment reaches dashboards.", sampleMessage: "Please confirm this booking summary." },
  { id: "f6", title: "Clinic dashboards update", description: "Reception and doctor queue receive the WhatsApp appointment.", sampleMessage: "Token WA014 confirmed." }
];

export const templates: WhatsAppTemplate[] = [
  ["Welcome - Multi-speciality", "booking", "active", "Welcome to {{clinic_name}}. What type of care do you need?"],
  ["Department Selection", "booking", "active", "Please choose: Dermatology, Orthopaedics, Dental, Pediatrics, General Medicine, Physiotherapy, Hair Clinic, Other"],
  ["Welcome - Single-speciality", "booking", "active", "Welcome to {{clinic_name}}. How can we help? Book Appointment, View Appointment, Talk to Reception"],
  ["Doctor Selection", "booking", "active", "Please choose a doctor: {{doctor_options}}"],
  ["Date Selection", "booking", "active", "Please choose an available date: {{date_options}}"],
  ["Slot Selection", "booking", "needs_api_approval", "Available time slots: {{slot_options}}"],
  ["Patient Details", "booking", "active", "Please share full name, age, gender, and main problem."],
  ["Booking Confirmation", "booking", "active", "Confirmed. Token {{token_number}} with {{doctor_name}} on {{appointment_date}} at {{appointment_time}}."],
  ["Prescription Delivery", "follow_up", "draft", "Your prescription from {{doctor_name}} is ready. Please follow the dosage instructions."],
  ["Medicine Reminder", "reminder", "active", "Reminder: {{medicine_name}} {{dosage}} {{timing}}."],
  ["Follow-up Reminder", "follow_up", "active", "Your follow-up with {{doctor_name}} is due on {{follow_up_date}}."]
].map(([name, category, status, previewText], i) => ({ id: `tpl-${i + 1}`, name, category: category as WhatsAppTemplate["category"], status: status as WhatsAppTemplate["status"], previewText, variables: ["{{patient_name}}", "{{doctor_name}}", "{{appointment_date}}", "{{appointment_time}}", "{{token_number}}", "{{clinic_name}}", "{{medicine_name}}", "{{dosage}}", "{{follow_up_date}}"], lastUpdated: i < 7 ? "9 Jul 2026" : "7 Jul 2026" }));

const multiMessages = [
  { id: "s1", sender: "patient" as const, text: "Hi", time: "Now" },
  { id: "s2", sender: "bot" as const, text: "Welcome to Vernex Clinic. What type of care do you need?\nDermatology, Orthopaedics, Dental, Pediatrics, General Medicine, Physiotherapy, Hair Clinic, Other\nYou can also choose Talk to Reception.", time: "Now" },
  { id: "s3", sender: "patient" as const, text: "General Medicine", time: "Now" },
  { id: "s4", sender: "bot" as const, text: "Available doctors:\nDr. Priya Sharma, MBBS, MD - General Medicine - Rs 600 - Next: Today 10:30 AM", time: "Now" },
  { id: "s5", sender: "patient" as const, text: "Dr. Priya Sharma", time: "Now" },
  { id: "s6", sender: "bot" as const, text: "Please choose a date: Today, Tomorrow, Saturday", time: "Now" },
  { id: "s7", sender: "patient" as const, text: "Today", time: "Now" },
  { id: "s8", sender: "bot" as const, text: "Available slots: 10:00 AM, 10:30 AM. Talk to Reception is always available.", time: "Now" },
  { id: "s9", sender: "patient" as const, text: "10:30 AM", time: "Now" },
  { id: "s10", sender: "bot" as const, text: "Please share full name, age, gender, main problem, and whether you are an existing patient.", time: "Now" },
  { id: "s11", sender: "patient" as const, text: "Neha Iyer, 31, Female, fever and throat pain, existing patient", time: "Now" },
  { id: "s12", sender: "bot" as const, text: "Booking summary:\nDr. Priya Sharma - General Medicine\nToday at 10:30 AM\nToken WA014\nClinic address: 12, 5th Main Road, Indiranagar\nPlease arrive 10 minutes early. Reply Confirm, Reschedule, Cancel, or Talk to Reception.", time: "Now" },
  { id: "s13", sender: "patient" as const, text: "Confirm", time: "Now" },
  { id: "s14", sender: "bot" as const, text: "Confirmed. Your booking ID is WA-APT-1024. A reminder will be sent before your visit.", time: "Now" }
];

const singleMessages = [
  { id: "g1", sender: "patient" as const, text: "Hi", time: "Now" },
  { id: "g2", sender: "bot" as const, text: "Welcome to Vernex Skin & Hair Clinic. How can we help?\nBook Appointment\nView Appointment\nTalk to Reception", time: "Now" },
  { id: "g3", sender: "patient" as const, text: "Book Appointment", time: "Now" },
  { id: "g4", sender: "bot" as const, text: "Please choose a doctor: Dr. Kavya Nair - Skin Allergy & Acne - Rs 800 - Next: Today 12:00 PM", time: "Now" },
  { id: "g5", sender: "bot" as const, text: "Choose date and time: Today 12:00 PM, Tomorrow 11:00 AM, Saturday 01:00 PM. Talk to Reception is available anytime.", time: "Now" },
  { id: "g6", sender: "bot" as const, text: "Please share full name, age, gender, and the problem you are facing.", time: "Now" },
  { id: "g7", sender: "bot" as const, text: "Summary ready. Reply Confirm, Reschedule, Cancel, or Talk to Reception.", time: "Now" }
];

export const simulationByMode: Record<ClinicMode, WhatsAppBookingSimulation> = {
  multi_speciality: { clinicMode: "multi_speciality", selectedClinic: "Vernex Multispeciality Clinic", selectedDepartment: "general_medicine", selectedDoctor: "Dr. Priya Sharma", selectedService: "General Medicine", selectedSlot: "Today 10:30 AM", patientDetails: "Neha Iyer - 31 - Female - Existing patient", currentStep: "confirmed", messages: multiMessages, confirmedAppointment: confirmedWhatsappAppointment },
  single_speciality: { clinicMode: "single_speciality", selectedClinic: "Vernex Skin & Hair Clinic", selectedDepartment: "dermatology", selectedDoctor: "Dr. Kavya Nair", selectedService: "Skin Consultation", selectedSlot: "Today 12:00 PM", patientDetails: "Ananya Rao - 26 - Female - New patient", currentStep: "review_booking", messages: singleMessages, confirmedAppointment: { ...confirmedWhatsappAppointment, appointmentId: "WA-APT-1025", tokenNumber: "WA015", patientName: "Ananya Rao", age: 26, department: "dermatology", doctorId: "doc-kavya", doctorName: "Dr. Kavya Nair", appointmentTime: "12:00 PM", mainProblem: "Acne flare-up and skin irritation", isNewPatient: true } }
};

export const simulation = simulationByMode.multi_speciality;

export const conversations: WhatsAppConversation[] = [
  { id: "c1", patientName: "Neha Iyer", phone: "+91 98765 43210", lastMessage: "Token WA014 confirmed. Thank you.", currentStep: "Confirmed", status: "appointment_confirmed", source: "whatsapp", appointmentToken: "WA014", lastUpdated: "10:31 AM", messages: multiMessages, bookingSummary: { token: "WA014", patientName: "Neha Iyer", doctorName: "Dr. Priya Sharma", service: "General Medicine", dateTime: "Today - 10:30 AM" } },
  { id: "c2", phone: "+91 99887 77665", lastMessage: "Please choose a slot.", currentStep: "Slot selection", status: "waiting_for_patient", source: "qr", lastUpdated: "10:40 AM", messages: multiMessages.slice(0, 8) },
  { id: "c3", patientName: "Ramesh Gupta", phone: "+91 90000 11122", lastMessage: "Transferred to reception.", currentStep: "Reception handoff", status: "transferred_to_reception", source: "whatsapp", lastUpdated: "09:58 AM", messages: [...singleMessages.slice(0, 3), { id: "r1", sender: "reception", text: "Reception will call you shortly.", time: "09:58 AM" }] }
];

export const settings: WhatsAppBookingSettings = { businessNumber: "+91 98765 43210", displayName: "Vernex Clinic", businessProfileStatus: "Demo profile - Not verified", clinicMode: "multi_speciality", enableBooking: true, allowExistingPatientLookup: true, requirePaymentBeforeConfirmation: false, autoCreateAppointment: true, sendReminderBeforeAppointment: true, reminderTiming: "2 hours before", reminderTemplate: "Appointment Reminder", followUpReminder: true, handoffOnStaff: true, handoffAfterFailedAttempts: true, receptionContactDisplay: "+91 98765 43210", apiStatus: "not_connected", provider: "meta_cloud_api" };
