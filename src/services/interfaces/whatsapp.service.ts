import type { WhatsAppConversationRecord } from "../../shared/types/domain";

export interface WhatsAppService {
  getConversations(clinicId?: string): Promise<WhatsAppConversationRecord[]>;
  transferConversationToReception(id: string): Promise<WhatsAppConversationRecord>;
}
