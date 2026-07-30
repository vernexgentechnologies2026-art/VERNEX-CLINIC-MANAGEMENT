import type { ReportRecord } from "../shared/types/domain";

export const mockReports: ReportRecord[] = [
  { id: "rep-patients-today", clinicId: "clinic-vernex", metric: "patients_today", value: 48, period: "2026-07-09" },
  { id: "rep-revenue-total", clinicId: "clinic-vernex", metric: "total_revenue", value: 128500, period: "2026-07" },
  { id: "rep-whatsapp-bookings", clinicId: "clinic-vernex", metric: "whatsapp_confirmed", value: 44, period: "2026-07" },
  { id: "rep-support-open", clinicId: "clinic-vernex", metric: "support_open", value: 2, period: "2026-07" }
];
