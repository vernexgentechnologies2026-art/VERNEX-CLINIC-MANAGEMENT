export type WhatsAppTemplateStatus = "active" | "draft" | "needs_api_approval" | "disabled";
export type WhatsAppTemplateCategory = "booking" | "reminder" | "payment" | "follow_up" | "review" | "cancellation";
export type WhatsAppConversationStatus = "new" | "in_progress" | "appointment_confirmed" | "waiting_for_patient" | "transferred_to_reception" | "closed" | "failed";
export type WhatsAppMessageSender = "patient" | "bot" | "reception";
export type WhatsAppProvider = "meta_cloud_api" | "interakt" | "aisensy" | "wati" | "gupshup" | "twilio";

export type WhatsAppBookingStats = { bookingRequests: number; appointmentsConfirmed: number; pendingConversations: number; remindersScheduled: number; failedMessages: number; templatesActive: number };
export type WhatsAppFlowStep = { id: string; title: string; description: string; sampleMessage: string };
export type WhatsAppTemplate = { id: string; name: string; category: WhatsAppTemplateCategory; status: WhatsAppTemplateStatus; previewText: string; variables: string[]; lastUpdated: string };
export type WhatsAppMessage = { id: string; sender: WhatsAppMessageSender; text: string; time: string };
export type WhatsAppBookingSummary = { token: string; patientName: string; doctorName: string; service: string; dateTime: string };
export type WhatsAppConversation = { id: string; patientName?: string; phone: string; lastMessage: string; currentStep: string; status: WhatsAppConversationStatus; source: "whatsapp" | "qr" | "website"; appointmentToken?: string; lastUpdated: string; messages: WhatsAppMessage[]; bookingSummary?: WhatsAppBookingSummary };
export type WhatsAppBookingSimulation = { selectedClinic: string; selectedDoctor: string; selectedService: string; selectedSlot: string; patientDetails: string; messages: WhatsAppMessage[] };
export type WhatsAppBookingSettings = { businessNumber: string; displayName: string; businessProfileStatus: string; enableBooking: boolean; allowExistingPatientLookup: boolean; requirePaymentBeforeConfirmation: boolean; autoCreateAppointment: boolean; sendReminderBeforeAppointment: boolean; reminderTiming: string; reminderTemplate: string; followUpReminder: boolean; handoffOnStaff: boolean; handoffAfterFailedAttempts: boolean; receptionContactDisplay: string; apiStatus: "not_connected" | "connected"; provider: WhatsAppProvider };
