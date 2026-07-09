import { mockResolve } from "../../mocks/mockConfig";
import { mockWhatsAppConversations } from "../../mocks/whatsappConversations.mock";
import type { WhatsAppService } from "../interfaces";

export const mockWhatsAppService: WhatsAppService = {
  getConversations: (clinicId) => mockResolve(clinicId ? mockWhatsAppConversations.filter((conversation) => conversation.clinicId === clinicId) : mockWhatsAppConversations),
  transferConversationToReception: (id) => mockResolve({ ...(mockWhatsAppConversations.find((conversation) => conversation.id === id) ?? mockWhatsAppConversations[0]), status: "transferred_to_reception" })
};
