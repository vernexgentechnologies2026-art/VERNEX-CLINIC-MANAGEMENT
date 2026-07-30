import type { PaymentRecord } from "../shared/types/domain";

export const mockPayments: PaymentRecord[] = [
  { id: "pay-1002-a", invoiceId: "inv-1002", amount: 600, mode: "upi", status: "paid", paidAt: "2026-07-09T11:34:00+05:30" },
  { id: "pay-failed-1", invoiceId: "inv-1001", amount: 950, mode: "online_link", status: "cancelled", paidAt: "2026-07-09T10:50:00+05:30" }
];
