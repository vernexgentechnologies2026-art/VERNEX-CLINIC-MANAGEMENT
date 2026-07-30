import { mockResolve } from "../../mocks/mockConfig";
import { mockSupportTickets } from "../../mocks/supportTickets.mock";
import type { SupportTicketRecord } from "../../shared/types/domain";
import type { SupportService } from "../interfaces";

export const mockSupportService: SupportService = {
  getTickets: (clinicId) => mockResolve(clinicId ? mockSupportTickets.filter((ticket) => ticket.clinicId === clinicId) : mockSupportTickets),
  createTicket: (input: Omit<SupportTicketRecord, "id" | "status">) => mockResolve({ ...input, id: `ticket-${Date.now()}`, status: "open" })
};
