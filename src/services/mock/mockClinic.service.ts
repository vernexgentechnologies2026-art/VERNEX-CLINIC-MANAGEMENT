import { mockBranches } from "../../mocks/branches.mock";
import { mockClinics } from "../../mocks/clinics.mock";
import { mockResolve } from "../../mocks/mockConfig";
import type { ClinicService } from "../interfaces";

export const mockClinicService: ClinicService = {
  getClinics: () => mockResolve(mockClinics),
  getClinicById: (id) => mockResolve(mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]),
  getBranches: (clinicId) => mockResolve(mockBranches.filter((branch) => branch.clinicId === clinicId)),
  getEnabledModules: (clinicId) => mockResolve((mockClinics.find((clinic) => clinic.id === clinicId) ?? mockClinics[0]).enabledModules)
};
