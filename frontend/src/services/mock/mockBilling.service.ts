import { mockInvoices } from "../../mocks/invoices.mock";
import { mockResolve } from "../../mocks/mockConfig";
import { mockPayments } from "../../mocks/payments.mock";
import type { Tables } from "../../shared/types/database.types";
import type { BillingDomainService } from "../interfaces";

const now = () => new Date().toISOString();

function mockInvoiceRow(input: Partial<Tables<"invoices">> = {}): Tables<"invoices"> {
  return {
    id: input.id ?? `invoice-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    patient_id: input.patient_id ?? "patient-1",
    appointment_id: input.appointment_id ?? null,
    consultation_id: input.consultation_id ?? null,
    prescription_id: input.prescription_id ?? null,
    pharmacy_order_id: input.pharmacy_order_id ?? null,
    invoice_number: input.invoice_number ?? `INV-${Date.now()}`,
    invoice_type: input.invoice_type ?? "consultation",
    subtotal: input.subtotal ?? 0,
    discount_amount: input.discount_amount ?? 0,
    tax_amount: input.tax_amount ?? 0,
    total_amount: input.total_amount ?? 0,
    paid_amount: input.paid_amount ?? 0,
    balance_amount: input.balance_amount ?? 0,
    payment_status: input.payment_status ?? "unpaid",
    invoice_status: input.invoice_status ?? "issued",
    notes: input.notes ?? null,
    created_by: input.created_by ?? null,
    cancelled_by: input.cancelled_by ?? null,
    cancelled_at: input.cancelled_at ?? null,
    cancellation_reason: input.cancellation_reason ?? null,
    metadata: input.metadata ?? {},
    created_at: input.created_at ?? now(),
    updated_at: input.updated_at ?? now(),
  };
}

function mockInvoiceItemRow(input: Partial<Tables<"invoice_items">> = {}): Tables<"invoice_items"> {
  return {
    id: input.id ?? `invoice-item-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    invoice_id: input.invoice_id ?? "invoice-1",
    item_type: input.item_type ?? "other",
    reference_id: input.reference_id ?? null,
    description: input.description ?? "General Consultation",
    quantity: input.quantity ?? 1,
    unit_price: input.unit_price ?? 0,
    discount_amount: input.discount_amount ?? 0,
    tax_rate: input.tax_rate ?? 0,
    tax_amount: input.tax_amount ?? 0,
    line_total: input.line_total ?? 0,
    created_at: input.created_at ?? now(),
  };
}

export const mockBillingDomainService: BillingDomainService = {
  getInvoices: (filters) => {
    const clinicId = typeof filters === "string" ? filters : filters?.clinicId;
    return mockResolve(clinicId ? mockInvoices.filter((invoice) => invoice.clinicId === clinicId) : mockInvoices);
  },
  getInvoiceById: (id) => mockResolve({ ...mockInvoiceRow({ id }), items: [mockInvoiceItemRow({ invoice_id: id })], patient: null }),
  getInvoicesByPatient: (patientId) => mockResolve(mockInvoices.filter((invoice) => invoice.patientId === patientId)),
  createInvoice: (input) => {
    const invoice = mockInvoiceRow(input.invoice);
    return mockResolve({ ...invoice, items: input.items.map((item) => mockInvoiceItemRow({ ...item, invoice_id: invoice.id, clinic_id: invoice.clinic_id })), patient: null });
  },
  createInvoiceFromPharmacyOrder: (pharmacyOrderId) => mockResolve(mockInvoiceRow({ pharmacy_order_id: pharmacyOrderId, invoice_type: "pharmacy" })),
  recordManualPayment: (input) => mockResolve(mockInvoiceRow({ id: input.invoiceId, paid_amount: input.amount, payment_status: "paid" })),
  cancelInvoice: (invoiceId, reason) => mockResolve(mockInvoiceRow({ id: invoiceId, invoice_status: "cancelled", cancellation_reason: reason })),
  getInvoiceStatusHistory: (invoiceId) => mockResolve([{ id: `hist-${Date.now()}`, clinic_id: "clinic-1", invoice_id: invoiceId, old_status: null, new_status: "issued", old_payment_status: null, new_payment_status: "unpaid", reason: "mock", changed_by: null, created_at: now() }]),
  getManualPayments: (invoiceId) => mockResolve((invoiceId ? mockPayments.filter((payment) => payment.invoiceId === invoiceId) : mockPayments).map((payment) => ({ id: payment.id, clinic_id: "clinic-1", branch_id: null, invoice_id: payment.invoiceId, patient_id: "patient-1", amount: payment.amount, payment_mode: payment.mode, reference_number: null, payment_note: null, received_by: null, received_at: payment.paidAt, created_at: payment.paidAt }))),
  getPayments: (invoiceId) => mockResolve(invoiceId ? mockPayments.filter((payment) => payment.invoiceId === invoiceId) : mockPayments)
};
