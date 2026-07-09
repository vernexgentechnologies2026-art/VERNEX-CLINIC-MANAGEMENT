import type { SupportTicketRecord } from "../../shared/types/domain";

export interface SupportService {
  getTickets(clinicId?: string): Promise<SupportTicketRecord[]>;
  createTicket(input: Omit<SupportTicketRecord, "id" | "status">): Promise<SupportTicketRecord>;
}
