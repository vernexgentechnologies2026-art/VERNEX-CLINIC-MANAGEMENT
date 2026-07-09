import type { ReportRecord } from "../../shared/types/domain";

export interface ReportingService {
  getReports(clinicId?: string): Promise<ReportRecord[]>;
}
