import type { WhatsAppConversationRecord } from "../shared/types/domain";

// linkedAppointmentId is set after the patient confirms booking summary in WhatsApp.
export const mockWhatsAppConversations: WhatsAppConversationRecord[] = [
  { id: "wa-conv-1001", clinicId: "clinic-vernex", patientId: "patient-neha", phone: "+91 98765 43210", status: "appointment_confirmed", linkedAppointmentId: "apt-wa-1001", lastMessage: "Confirmed. Your booking ID is WA-APT-1024." },
  { id: "wa-conv-2001", clinicId: "clinic-small", patientId: "patient-ananya", phone: "+91 99887 77665", status: "in_progress", linkedAppointmentId: "apt-wa-2001", lastMessage: "Please confirm or talk to reception." },
  { id: "wa-conv-failed", clinicId: "clinic-vernex", phone: "+91 95555 00000", status: "failed", lastMessage: "Template delivery failed placeholder." }
];
