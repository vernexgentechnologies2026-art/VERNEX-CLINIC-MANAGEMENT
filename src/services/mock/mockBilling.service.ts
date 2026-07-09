import { mockInvoices } from "../../mocks/invoices.mock";
import { mockResolve } from "../../mocks/mockConfig";
import { mockPayments } from "../../mocks/payments.mock";
import type { BillingDomainService } from "../interfaces";

export const mockBillingDomainService: BillingDomainService = {
  getInvoices: (clinicId) => mockResolve(clinicId ? mockInvoices.filter((invoice) => invoice.clinicId === clinicId) : mockInvoices),
  getPayments: (invoiceId) => mockResolve(invoiceId ? mockPayments.filter((payment) => payment.invoiceId === invoiceId) : mockPayments)
};
