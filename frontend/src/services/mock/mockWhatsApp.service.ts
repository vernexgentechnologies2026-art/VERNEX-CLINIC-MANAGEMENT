import { mockResolve } from "../../mocks/mockConfig";
import { conversations as seedConversations, templates as seedTemplates } from "../../modules/whatsapp-booking/mock";
import type { WhatsAppConversation, WhatsAppMessage, WhatsAppTemplate } from "../../modules/whatsapp-booking/types";
import type { WhatsAppService, WhatsAppConsentStatus, WhatsAppMessageInput, WhatsAppSendPlaceholderInput } from "../interfaces";

const conversations: WhatsAppConversation[] = seedConversations.map((item) => ({ ...item, messages: [...item.messages] }));
const templates: WhatsAppTemplate[] = seedTemplates.map((item) => ({ ...item, variables: [...item.variables] }));
const consents = new Map<string, WhatsAppConsentStatus>();

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createMockMessage(input: WhatsAppMessageInput): WhatsAppMessage {
  return {
    id: crypto.randomUUID(),
    sender: input.sender ?? (input.direction === "inbound" ? "patient" : "bot"),
    text: input.body,
    time: nowLabel(),
  };
}

async function sendPlaceholder(input: WhatsAppSendPlaceholderInput, messageType: NonNullable<WhatsAppMessageInput["messageType"]>) {
  return mockWhatsAppService.createMessage({
    ...input,
    messageType,
    direction: "outbound",
    sender: "bot",
    deliveryStatus: "queued",
    metadata: { ...input.metadata, placeholder: true, noExternalApi: true },
  });
}

export const mockWhatsAppService: WhatsAppService = {
  getConversations: () => mockResolve(conversations),
  getConversationById: (id) => mockResolve(conversations.find((conversation) => conversation.id === id) ?? null),
  createConversation: (input) => {
    const conversation: WhatsAppConversation = {
      id: crypto.randomUUID(),
      phone: input.phone,
      patientName: undefined,
      lastMessage: input.lastMessage ?? "Conversation created.",
      currentStep: input.currentStep ?? "New conversation",
      status: input.status ?? "new",
      source: input.source ?? "whatsapp",
      lastUpdated: nowLabel(),
      messages: [],
    };
    conversations.unshift(conversation);
    return mockResolve(conversation);
  },
  updateConversation: (id, input) => {
    const index = conversations.findIndex((conversation) => conversation.id === id);
    const current = conversations[index] ?? conversations[0];
    const next = { ...current, ...input, phone: input.phone ?? current.phone, lastUpdated: nowLabel() };
    if (index >= 0) conversations[index] = next;
    return mockResolve(next);
  },
  deleteConversation: (id) => {
    const index = conversations.findIndex((conversation) => conversation.id === id);
    if (index >= 0) conversations.splice(index, 1);
    return mockResolve(undefined);
  },
  transferConversationToReception: (id) => mockWhatsAppService.updateConversation(id, { status: "transferred_to_reception", currentStep: "Reception handoff", lastMessage: "Transferred to reception." }),
  getMessages: (conversationId) => mockResolve(conversations.find((conversation) => conversation.id === conversationId)?.messages ?? []),
  createMessage: (input) => {
    const message = createMockMessage(input);
    const conversation = conversations.find((item) => item.id === input.conversationId);
    if (conversation) {
      conversation.messages = [...conversation.messages, message];
      conversation.lastMessage = message.text;
      conversation.lastUpdated = message.time;
    }
    return mockResolve(message);
  },
  updateMessage: (id, input) => {
    for (const conversation of conversations) {
      const index = conversation.messages.findIndex((message) => message.id === id);
      if (index >= 0) {
        conversation.messages[index] = { ...conversation.messages[index], text: input.body ?? conversation.messages[index].text };
        return mockResolve(conversation.messages[index]);
      }
    }
    return mockResolve(createMockMessage({ ...input, phone: input.phone ?? "", body: input.body ?? "" }));
  },
  deleteMessage: (id) => {
    conversations.forEach((conversation) => {
      conversation.messages = conversation.messages.filter((message) => message.id !== id);
    });
    return mockResolve(undefined);
  },
  getTemplates: () => mockResolve(templates),
  createTemplate: (input) => {
    const template: WhatsAppTemplate = { id: crypto.randomUUID(), name: input.name, category: input.category as WhatsAppTemplate["category"], status: input.status ?? "draft", previewText: input.previewText, variables: input.variables ?? [], lastUpdated: new Date().toLocaleDateString() };
    templates.unshift(template);
    return mockResolve(template);
  },
  updateTemplate: (id, input) => {
    const index = templates.findIndex((template) => template.id === id);
    const current = templates[index] ?? templates[0];
    const next = { ...current, ...input, previewText: input.previewText ?? current.previewText, variables: input.variables ?? current.variables, lastUpdated: new Date().toLocaleDateString() } as WhatsAppTemplate;
    if (index >= 0) templates[index] = next;
    return mockResolve(next);
  },
  deleteTemplate: (id) => {
    const index = templates.findIndex((template) => template.id === id);
    if (index >= 0) templates.splice(index, 1);
    return mockResolve(undefined);
  },
  getConsent: (phone) => mockResolve(consents.get(phone) ?? "unknown"),
  upsertConsent: (input) => {
    consents.set(input.phone, input.consentStatus);
    return mockResolve(input.consentStatus);
  },
  createDeliveryLog: () => mockResolve(undefined),
  saveWebhookEventPlaceholder: () => mockResolve(undefined),
  sendAppointmentPlaceholder: (input) => sendPlaceholder(input, "appointment"),
  sendPrescriptionPlaceholder: (input) => sendPlaceholder(input, "prescription"),
  sendReminderPlaceholder: (input) => sendPlaceholder(input, "reminder"),
  sendInvoicePlaceholder: (input) => sendPlaceholder(input, "invoice"),
};
