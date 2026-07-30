import { mockBranches } from "../../mocks/branches.mock";
import { mockClinics } from "../../mocks/clinics.mock";
import { mockResolve } from "../../mocks/mockConfig";
import type { ClinicService } from "../interfaces";

export const mockClinicService: ClinicService = {
  getClinics: () => mockResolve(mockClinics),
  getClinicById: (id) => mockResolve(mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]),
  createClinic: (input) => mockResolve({ ...mockClinics[0], id: `clinic-${Date.now()}`, name: input.name, slug: input.slug, status: (input.status ?? "trial") as never, enabledModules: input.enabledModules ?? [] }),
  updateClinic: (id, input) => mockResolve({ ...(mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]), name: input.name ?? (mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]).name, slug: input.slug ?? (mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]).slug, status: (input.status ?? (mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]).status) as never, enabledModules: input.enabledModules ?? (mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]).enabledModules }),
  updateClinicStatus: (id, status) => mockResolve({ ...(mockClinics.find((clinic) => clinic.id === id) ?? mockClinics[0]), status: status as never }),
  getBranches: (clinicId) => mockResolve(mockBranches.filter((branch) => branch.clinicId === clinicId)),
  createBranch: (input) => mockResolve({ id: `branch-${Date.now()}`, clinicId: input.clinic_id, name: input.name, address: input.address ?? "", phone: input.phone ?? "", isPrimary: input.is_main ?? false }),
  updateBranch: (id, input) => mockResolve({ ...(mockBranches.find((branch) => branch.id === id) ?? mockBranches[0]), name: input.name ?? mockBranches[0].name, address: input.address ?? mockBranches[0].address, phone: input.phone ?? mockBranches[0].phone, isPrimary: input.is_main ?? mockBranches[0].isPrimary }),
  getEnabledModules: (clinicId) => mockResolve((mockClinics.find((clinic) => clinic.id === clinicId) ?? mockClinics[0]).enabledModules)
};
