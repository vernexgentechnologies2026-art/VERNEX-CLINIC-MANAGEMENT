import { mockClinics } from "../mocks/clinics.mock";
import { mockUsers } from "../mocks/users.mock";
import type { UserRole } from "../types/user";

export function getMockAccessContext(role: UserRole) {
  const user = mockUsers.find((item) => item.role === role) ?? mockUsers[1];
  const enabledClinicModules = mockClinics.find((clinic) => clinic.id === user.clinicId)?.enabledModules ?? [];

  return {
    user,
    enabledClinicModules,
  };
}
