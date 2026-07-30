import { supabase } from "../../lib/supabaseClient";
import type { WhatsAppConversation, WhatsAppMessage, WhatsAppTemplate } from "../../modules/whatsapp-booking/types";
import { mockWhatsAppService } from "../mock/mockWhatsApp.service";
import type { WhatsAppConsentStatus, WhatsAppMessageInput, WhatsAppSendPlaceholderInput, WhatsAppService } from "../interfaces";
import { logAuditEvent } from "./auditLogger";
import { supabaseAuthService } from "./supabaseAuth.service";

type AnyRow = Record<string, any>;

const db = supabase as unknown as { from: (table: string) => any };

function isUuid(value?: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function context(inputClinicId?: string, inputBranchId?: string | null) {
  const fallbackClinicId = "00000000-0000-4000-8000-000000000012";
  const auth = await supabaseAuthService.getCurrentAuthContext().catch(() => null);
  const clinicId = inputClinicId ?? auth?.clinic_id ?? fallbackClinicId;
  if (!clinicId) throw new Error("Clinic context is required for WhatsApp storage.");
  return { clinicId, branchId: inputBranchId ?? auth?.branch_id ?? null, staffId: auth?.staffProfileId ?? null };
}

function fallback<T>(operation: () => Promise<T>, backup: () => Promise<T>) {
  return operation().catch(() => backup());
}

function mapMessage(row: AnyRow): WhatsAppMessage {
  return {
    id: row.id,
    sender: row.sender_type ?? (row.direction === "inbound" ? "patient" : "bot"),
    text: row.body ?? "",
    time: new Date(row.created_at ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function mapTemplate(row: AnyRow): WhatsAppTemplate {
  const variables = Array.isArray(row.variables) ? row.variables : [];
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    status: row.status,
    previewText: row.body,
    variables,
    lastUpdated: new Date(row.updated_at ?? row.created_at ?? Date.now()).toLocaleDateString(),
  };
}

function mapConversation(row: AnyRow): WhatsAppConversation {
  const messages = (row.whatsapp_messages ?? []).map(mapMessage);
  const lastMessage = row.last_message ?? messages[messages.length - 1]?.text ?? "";
  return {
    id: row.id,
    patientName: row.patients?.full_name ?? row.metadata?.patientName,
    phone: row.phone_number,
    lastMessage,
    currentStep: row.current_step ?? "Stored conversation",
    status: row.status,
    source: row.source ?? "whatsapp",
    appointmentToken: row.metadata?.appointmentToken,
    lastUpdated: new Date(row.updated_at ?? row.created_at ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    messages,
    bookingSummary: row.metadata?.bookingSummary,
  };
}

function messagePayload(input: WhatsAppMessageInput, scoped: Awaited<ReturnType<typeof context>>) {
  return {
    clinic_id: scoped.clinicId,
    branch_id: input.branchId ?? scoped.branchId,
    conversation_id: isUuid(input.conversationId) ? input.conversationId : null,
    patient_id: isUuid(input.patientId) ? input.patientId : null,
    phone_number: input.phone,
    status: input.deliveryStatus ?? "queued",
    direction: input.direction ?? "outbound",
    sender_type: input.sender ?? "bot",
    message_type: input.messageType ?? "text",
    body: input.body,
    template_id: isUuid(input.templateId) ? input.templateId : null,
    related_type: input.relatedType ?? null,
    related_id: isUuid(input.relatedId) ? input.relatedId : null,
    delivery_status: input.deliveryStatus ?? "queued",
    payload: input.payload ?? {},
    metadata: input.metadata ?? {},
    sent_by: scoped.staffId,
  };
}

async function createPlaceholderMessage(input: WhatsAppSendPlaceholderInput, messageType: NonNullable<WhatsAppMessageInput["messageType"]>) {
  const message = await supabaseWhatsAppService.createMessage({
    ...input,
    direction: "outbound",
    sender: "bot",
    messageType,
    deliveryStatus: "queued",
    metadata: { ...input.metadata, placeholder: true, noExternalApi: true },
  });
  await supabaseWhatsAppService.createDeliveryLog({
    clinicId: input.clinicId,
    branchId: input.branchId,
    conversationId: input.conversationId,
    messageId: message.id,
    patientId: input.patientId,
    phone: input.phone,
    deliveryStatus: "queued",
    metadata: { placeholder: true, noExternalApi: true, messageType },
  });
  logAuditEvent({ clinicId: input.clinicId, branchId: input.branchId, eventType: "whatsapp_placeholder_sent", entityType: "whatsapp_messages", entityId: message.id, action: "send_placeholder", status: "success", severity: "info", message: "WhatsApp placeholder queued.", metadata: { noExternalApi: true, messageType, phone: input.phone, related_id: input.relatedId } });
  return message;
}

export const supabaseWhatsAppService: WhatsAppService = {
  getConversations(clinicId) {
    return fallback(async () => {
      let query = db.from("whatsapp_conversations").select("*, patients(full_name), whatsapp_messages(*)").order("updated_at", { ascending: false }).order("created_at", { foreignTable: "whatsapp_messages", ascending: true });
      if (clinicId) query = query.eq("clinic_id", clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapConversation);
    }, () => mockWhatsAppService.getConversations(clinicId));
  },

  getConversationById(id) {
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_conversations").select("*, patients(full_name), whatsapp_messages(*)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapConversation(data) : null;
    }, () => mockWhatsAppService.getConversationById(id));
  },

  async createConversation(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_conversations").insert({
        clinic_id: scoped.clinicId,
        branch_id: scoped.branchId,
        patient_id: isUuid(input.patientId) ? input.patientId : null,
        phone_number: input.phone,
        status: input.status ?? "new",
        source: input.source ?? "whatsapp",
        current_step: input.currentStep ?? "New conversation",
        linked_appointment_id: isUuid(input.linkedAppointmentId) ? input.linkedAppointmentId : null,
        last_message: input.lastMessage ?? "Conversation created.",
        metadata: input.metadata ?? {},
        created_by: scoped.staffId,
      }).select("*, patients(full_name), whatsapp_messages(*)").single();
      if (error) throw error;
      return mapConversation(data);
    }, () => mockWhatsAppService.createConversation(input));
  },

  async updateConversation(id, input) {
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_conversations").update({
        branch_id: input.branchId,
        patient_id: isUuid(input.patientId) ? input.patientId : undefined,
        phone_number: input.phone,
        status: input.status,
        source: input.source,
        current_step: input.currentStep,
        linked_appointment_id: isUuid(input.linkedAppointmentId) ? input.linkedAppointmentId : undefined,
        last_message: input.lastMessage,
        metadata: input.metadata,
      }).eq("id", id).select("*, patients(full_name), whatsapp_messages(*)").single();
      if (error) throw error;
      return mapConversation(data);
    }, () => mockWhatsAppService.updateConversation(id, input));
  },

  deleteConversation(id) {
    return fallback(async () => {
      const { error } = await db.from("whatsapp_conversations").delete().eq("id", id);
      if (error) throw error;
    }, () => mockWhatsAppService.deleteConversation(id));
  },

  transferConversationToReception(id) {
    return this.updateConversation(id, { status: "transferred_to_reception", currentStep: "Reception handoff", lastMessage: "Transferred to reception." });
  },

  getMessages(conversationId) {
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapMessage);
    }, () => mockWhatsAppService.getMessages(conversationId));
  },

  async createMessage(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const payload = messagePayload(input, scoped);
      const { data, error } = await db.from("whatsapp_messages").insert(payload).select("*").single();
      if (error) throw error;
      if (payload.conversation_id) {
        await db.from("whatsapp_conversations").update({ last_message: input.body, status: input.messageType === "system" ? undefined : "in_progress" }).eq("id", payload.conversation_id);
      }
      return mapMessage(data);
    }, () => mockWhatsAppService.createMessage(input));
  },

  updateMessage(id, input) {
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_messages").update({
        body: input.body,
        delivery_status: input.deliveryStatus,
        status: input.deliveryStatus,
        payload: input.payload,
        metadata: input.metadata,
      }).eq("id", id).select("*").single();
      if (error) throw error;
      return mapMessage(data);
    }, () => mockWhatsAppService.updateMessage(id, input));
  },

  deleteMessage(id) {
    return fallback(async () => {
      const { error } = await db.from("whatsapp_messages").delete().eq("id", id);
      if (error) throw error;
    }, () => mockWhatsAppService.deleteMessage(id));
  },

  getTemplates(clinicId) {
    return fallback(async () => {
      let query = db.from("whatsapp_templates").select("*").order("updated_at", { ascending: false });
      if (clinicId) query = query.eq("clinic_id", clinicId);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapTemplate);
    }, () => mockWhatsAppService.getTemplates(clinicId));
  },

  async createTemplate(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_templates").insert({
        clinic_id: scoped.clinicId,
        branch_id: scoped.branchId,
        name: input.name,
        category: input.category,
        status: input.status ?? "draft",
        body: input.previewText,
        variables: input.variables ?? [],
        metadata: input.metadata ?? {},
        created_by: scoped.staffId,
      }).select("*").single();
      if (error) throw error;
      return mapTemplate(data);
    }, () => mockWhatsAppService.createTemplate(input));
  },

  updateTemplate(id, input) {
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_templates").update({
        name: input.name,
        category: input.category,
        status: input.status,
        body: input.previewText,
        variables: input.variables,
        metadata: input.metadata,
      }).eq("id", id).select("*").single();
      if (error) throw error;
      return mapTemplate(data);
    }, () => mockWhatsAppService.updateTemplate(id, input));
  },

  deleteTemplate(id) {
    return fallback(async () => {
      const { error } = await db.from("whatsapp_templates").delete().eq("id", id);
      if (error) throw error;
    }, () => mockWhatsAppService.deleteTemplate(id));
  },

  getConsent(phone, clinicId) {
    return fallback(async () => {
      let query = db.from("whatsapp_patient_consents").select("consent_status").eq("phone_number", phone);
      if (clinicId) query = query.eq("clinic_id", clinicId);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return (data?.consent_status ?? "unknown") as WhatsAppConsentStatus;
    }, () => mockWhatsAppService.getConsent(phone, clinicId));
  },

  async upsertConsent(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const { data, error } = await db.from("whatsapp_patient_consents").upsert({
        clinic_id: scoped.clinicId,
        branch_id: scoped.branchId,
        patient_id: isUuid(input.patientId) ? input.patientId : null,
        phone_number: input.phone,
        consent_status: input.consentStatus,
        consent_source: input.consentSource ?? "staff",
        consented_at: input.consentStatus === "opted_in" ? new Date().toISOString() : null,
        revoked_at: input.consentStatus === "revoked" || input.consentStatus === "opted_out" ? new Date().toISOString() : null,
        metadata: input.metadata ?? {},
        created_by: scoped.staffId,
      }, { onConflict: "clinic_id,phone_number" }).select("consent_status").single();
      if (error) throw error;
      return data.consent_status as WhatsAppConsentStatus;
    }, () => mockWhatsAppService.upsertConsent(input));
  },

  async createDeliveryLog(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const { error } = await db.from("whatsapp_delivery_logs").insert({
        clinic_id: scoped.clinicId,
        branch_id: scoped.branchId,
        conversation_id: isUuid(input.conversationId) ? input.conversationId : null,
        message_id: isUuid(input.messageId) ? input.messageId : null,
        patient_id: isUuid(input.patientId) ? input.patientId : null,
        phone_number: input.phone ?? null,
        delivery_status: input.deliveryStatus,
        payload: input.payload ?? {},
        metadata: input.metadata ?? {},
        created_by: scoped.staffId,
      });
      if (error) throw error;
    }, () => mockWhatsAppService.createDeliveryLog(input));
  },

  async saveWebhookEventPlaceholder(input) {
    const scoped = await context(input.clinicId, input.branchId);
    return fallback(async () => {
      const { error } = await db.from("whatsapp_webhook_events").insert({
        clinic_id: scoped.clinicId,
        branch_id: scoped.branchId,
        provider: "placeholder",
        provider_event_id: input.providerEventId ?? null,
        event_type: input.eventType ?? "placeholder",
        payload: input.payload ?? {},
        metadata: { ...input.metadata, noRealWebhook: true },
        created_by: scoped.staffId,
      });
      if (error) throw error;
    }, () => mockWhatsAppService.saveWebhookEventPlaceholder(input));
  },

  sendAppointmentPlaceholder: (input) => createPlaceholderMessage(input, "appointment"),
  sendPrescriptionPlaceholder: (input) => createPlaceholderMessage(input, "prescription"),
  sendReminderPlaceholder: (input) => createPlaceholderMessage(input, "reminder"),
  sendInvoicePlaceholder: (input) => createPlaceholderMessage(input, "invoice"),
};
