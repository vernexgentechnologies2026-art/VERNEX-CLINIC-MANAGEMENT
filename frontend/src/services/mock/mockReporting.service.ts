import { mockResolve } from "../../mocks/mockConfig";
import { mockReports } from "../../mocks/reports.mock";
import { appointmentReport, doctorPerformanceReport, patientReport, pharmacySalesReport, revenueReport } from "../../modules/billing/mock";
import type { Tables } from "../../shared/types/database.types";
import type { ReportingService } from "../interfaces";

const now = () => new Date().toISOString();

function mockSnapshot(input: Partial<Tables<"report_snapshots">> = {}): Tables<"report_snapshots"> {
  return {
    id: input.id ?? `snapshot-${Date.now()}`,
    clinic_id: input.clinic_id ?? "clinic-1",
    branch_id: input.branch_id ?? null,
    report_type: input.report_type ?? "dashboard",
    period_start: input.period_start ?? null,
    period_end: input.period_end ?? null,
    data: input.data ?? {},
    generated_by: input.generated_by ?? null,
    generated_at: input.generated_at ?? now(),
    created_at: input.created_at ?? now(),
  };
}

export const mockReportingService: ReportingService = {
  getReports: (clinicId) => mockResolve(clinicId ? mockReports.filter((report) => report.clinicId === clinicId) : mockReports),
  getDashboardSummary: () => mockResolve({ totalPatients: 0, todayAppointments: appointmentReport.total, completedConsultations: appointmentReport.completed, pendingPrescriptions: 0, pharmacyOrders: pharmacySalesReport.billsGenerated, lowStockMedicines: 0, totalInvoices: 0, paidAmount: revenueReport.totalRevenue, pendingAmount: revenueReport.pendingAmount, revenueByDateRange: revenueReport.totalRevenue }),
  getAppointmentReport: () => mockResolve(appointmentReport),
  getPatientReport: () => mockResolve(patientReport),
  getConsultationReport: () => mockResolve({ total: appointmentReport.completed, completed: appointmentReport.completed, draft: 0, cancelled: appointmentReport.cancelled }),
  getPrescriptionReport: () => mockResolve({ total: 0, draft: 0, finalized: 0, sentToPharmacy: 0, whatsappSent: 0 }),
  getPharmacyReport: () => mockResolve(pharmacySalesReport),
  getBillingReport: () => mockResolve(revenueReport),
  getRevenueSummary: () => mockResolve(revenueReport),
  getLowStockReport: () => mockResolve({ activeAlerts: 0, outOfStock: 0, lowStock: 0 }),
  getDoctorPerformanceReport: () => mockResolve(doctorPerformanceReport),
  generateReportSnapshot: (input) => mockResolve(mockSnapshot(input)),
  getReportSnapshots: () => mockResolve([mockSnapshot()])
};
