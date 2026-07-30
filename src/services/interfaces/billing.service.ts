import type { InvoiceRecord, PaymentRecord } from "../../shared/types/domain";

export interface BillingDomainService {
  getInvoices(clinicId?: string): Promise<InvoiceRecord[]>;
  getPayments(invoiceId?: string): Promise<PaymentRecord[]>;
}
