import type { ReactNode } from "react";
import { mockUsers } from "../mocks/users.mock";
import type { PermissionKey } from "../shared/types/domain";
import type { UserRole } from "../types/user";

export function PermissionGuard({ permission, children, fallback = null }: { permission: PermissionKey; children: ReactNode; fallback?: ReactNode }) {
  const role = (localStorage.getItem("vernex_role") as UserRole) || "owner";
  const user = mockUsers.find((item) => item.role === role);
  return user?.permissions.includes(permission) ? <>{children}</> : <>{fallback}</>;
}
