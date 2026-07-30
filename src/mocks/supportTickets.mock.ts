import type { SupportTicketRecord } from "../shared/types/domain";

export const mockSupportTickets: SupportTicketRecord[] = [
  { id: "ticket-1001", clinicId: "clinic-vernex", branchId: "branch-indiranagar", createdByUserId: "user-owner-1", category: "whatsapp", priority: "high", status: "open", subject: "WhatsApp template approval pending" },
  { id: "ticket-1002", clinicId: "clinic-vernex", branchId: "branch-indiranagar", createdByUserId: "user-pharmacy-1", category: "pharmacy", priority: "medium", status: "in_progress", subject: "Batch expiry report mismatch" },
  { id: "ticket-1003", clinicId: "clinic-small", createdByUserId: "user-doctor-owner", category: "billing", priority: "low", status: "resolved", subject: "Invoice export question" }
];
