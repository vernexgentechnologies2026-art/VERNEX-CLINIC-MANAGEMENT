import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { mockClinics } from "../mocks/clinics.mock";
import { mockUsers } from "../mocks/users.mock";
import type { ModuleKey } from "../shared/types/domain";
import type { UserRole } from "../types/user";
import { canAccess } from "./canAccess";

export function ModuleGuard({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const role = (localStorage.getItem("vernex_role") as UserRole) || "owner";
  const user = mockUsers.find((item) => item.role === role) ?? mockUsers[1];
  const clinicModules = mockClinics.find((clinic) => clinic.id === user.clinicId)?.enabledModules ?? [];
  return canAccess(user, module, "view", clinicModules) ? <>{children}</> : <Navigate to="/login" replace />;
}
