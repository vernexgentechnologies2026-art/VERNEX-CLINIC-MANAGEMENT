import type { BranchRecord, ClinicRecord, ModuleKey } from "../../shared/types/domain";

export interface ClinicService {
  getClinics(): Promise<ClinicRecord[]>;
  getClinicById(id: string): Promise<ClinicRecord>;
  getBranches(clinicId: string): Promise<BranchRecord[]>;
  getEnabledModules(clinicId: string): Promise<ModuleKey[]>;
}
