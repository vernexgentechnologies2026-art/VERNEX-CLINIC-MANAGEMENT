import type { AppointmentReport, BillingStats, DoctorPerformanceReport, FollowUpReport, Invoice, PatientReport, PharmacySalesReport, PendingPayment, Receipt, Refund, RevenueReport } from "./types";

export const billingStats: BillingStats = { todayRevenue: 84650, consultationRevenue: 31800, pharmacyRevenue: 22840, pendingPayments: 18600, partialPayments: 7400, refunds: 2200, billsGenerated: 64, onlinePaymentLinks: 12 };

const item = (id: string, name: string, category: string, quantity: number, unitPrice: number, discount = 0, tax = 0) => ({ id, name, category, quantity, unitPrice, discount, tax });
export const invoices: Invoice[] = [
  { id: "INV-2401", patientName: "Neha Iyer", phone: "+91 98765 43210", doctorName: "Dr. Priya Sharma", billType: "consultation", items: [item("i1", "General Consultation", "Consultation", 1, 600)], subtotal: 600, discount: 0, tax: 0, total: 600, paidAmount: 600, balance: 0, paymentStatus: "paid", paymentMode: "upi", date: "2026-07-01 10:42 AM" },
  { id: "INV-2402", patientName: "Arjun Nair", phone: "+91 99887 77665", doctorName: "Dr. Rohan Mehta", billType: "procedure", items: [item("i2", "Dental Cleaning", "Dental", 1, 1800, 100, 0)], subtotal: 1800, discount: 100, tax: 0, total: 1700, paidAmount: 1000, balance: 700, paymentStatus: "partial", paymentMode: "card", date: "2026-07-01 11:05 AM" },
  { id: "INV-2403", patientName: "Fatima Shaikh", phone: "+91 91234 56780", doctorName: "Dr. Aisha Khan", billType: "pharmacy", items: [item("i3", "Cetirizine 10mg", "Pharmacy", 10, 2), item("i4", "Skin Allergy Cream", "Pharmacy", 1, 80)], subtotal: 100, discount: 0, tax: 0, total: 100, paidAmount: 0, balance: 100, paymentStatus: "pending", paymentMode: "online_link", date: "2026-07-01 11:18 AM" },
  { id: "INV-2404", patientName: "Ramesh Gupta", phone: "+91 90000 11122", doctorName: "Dr. Priya Sharma", billType: "package", items: [item("i5", "Senior Wellness Package", "Package", 1, 3500, 250)], subtotal: 3500, discount: 250, tax: 0, total: 3250, paidAmount: 3250, balance: 0, paymentStatus: "paid", paymentMode: "cash", date: "2026-07-01 12:00 PM" }
];

export const receipts: Receipt[] = [
  { id: "RCT-101", patientName: "Neha Iyer", amountPaid: 600, paymentMode: "upi", linkedInvoice: "INV-2401", dateTime: "2026-07-01 10:44 AM", receiptType: "consultation" },
  { id: "RCT-102", patientName: "Arjun Nair", amountPaid: 1000, paymentMode: "card", linkedInvoice: "INV-2402", dateTime: "2026-07-01 11:06 AM", receiptType: "procedure" },
  { id: "RCT-103", patientName: "Ramesh Gupta", amountPaid: 3250, paymentMode: "cash", linkedInvoice: "INV-2404", dateTime: "2026-07-01 12:02 PM", receiptType: "package" }
];

export const pendingPayments: PendingPayment[] = invoices.filter((i) => i.balance > 0).map((i) => ({ id: `pp-${i.id}`, patientName: i.patientName, phone: i.phone, invoiceNumber: i.id, totalAmount: i.total, paidAmount: i.paidAmount, balance: i.balance, dueSince: i.date, lastReminder: "WhatsApp reminder draft", paymentStatus: i.paymentStatus }));
export const refunds: Refund[] = [
  { id: "REF-701", patientName: "Meera Patel", invoiceNumber: "INV-2310", originalAmount: 900, refundAmount: 900, reason: "Doctor unavailable", status: "requested", date: "2026-07-01" },
  { id: "REF-702", patientName: "Karthik Menon", invoiceNumber: "INV-2298", originalAmount: 1200, refundAmount: 500, reason: "Partial package cancellation", status: "processed", date: "2026-06-30" }
];

export const revenueReport: RevenueReport = {
  totalRevenue: 84650, consultationRevenue: 31800, pharmacyRevenue: 22840, procedureRevenue: 30010, pendingAmount: 18600, refundAmount: 2200,
  trend: ["25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun", "30 Jun", "1 Jul"].map((date, i) => ({ date, revenue: [42000, 50500, 46200, 61200, 58000, 69400, 84650][i] })),
  paymentModes: [{ mode: "upi", amount: 38200 }, { mode: "cash", amount: 21400 }, { mode: "card", amount: 17800 }, { mode: "online_link", amount: 7250 }],
  topServices: ["General Consultation", "Dental Checkup", "Skin Consultation", "Hair Treatment Consultation", "Pediatric Consultation", "Physiotherapy Session"].map((service, i) => ({ service, revenue: [18000, 15400, 13200, 9800, 7200, 6500][i], count: [30, 16, 12, 7, 9, 5][i] }))
};
export const appointmentReport: AppointmentReport = { total: 118, completed: 94, cancelled: 8, noShow: 6, whatsapp: 28, qr: 17, walkIns: 39, phone: 34 };
export const doctorPerformanceReport: DoctorPerformanceReport[] = [
  { doctorName: "Dr. Priya Sharma", consultations: 32, revenue: 22600, averageTime: "14 min", followUps: 9, prescriptions: 28 },
  { doctorName: "Dr. Rohan Mehta", consultations: 18, revenue: 30400, averageTime: "22 min", followUps: 6, prescriptions: 14 },
  { doctorName: "Dr. Aisha Khan", consultations: 20, revenue: 21650, averageTime: "18 min", followUps: 7, prescriptions: 18 }
];
export const pharmacySalesReport: PharmacySalesReport = { revenue: 22840, billsGenerated: 27, topMedicines: [{ medicine: "Paracetamol 500mg", amount: 2400 }, { medicine: "Skin Allergy Cream", amount: 1900 }, { medicine: "ORS Sachet", amount: 1450 }], lowStockImpact: 3400, expiryLoss: 1250 };
export const patientReport: PatientReport = { newPatients: 42, repeatPatients: 76, vipPatients: 5, followUpPatients: 22, sourceSplit: [{ source: "WhatsApp", count: 28 }, { source: "Walk-in", count: 39 }, { source: "Phone", count: 34 }, { source: "QR", count: 17 }] };
export const followUpReport: FollowUpReport = { dueToday: 11, upcoming: 32, overdue: 5, completed: 19, whatsappReminders: 26 };
