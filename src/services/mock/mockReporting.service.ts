import { mockResolve } from "../../mocks/mockConfig";
import { mockReports } from "../../mocks/reports.mock";
import type { ReportingService } from "../interfaces";

export const mockReportingService: ReportingService = {
  getReports: (clinicId) => mockResolve(clinicId ? mockReports.filter((report) => report.clinicId === clinicId) : mockReports)
};
