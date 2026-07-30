import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoadingSkeleton } from "../components/ui";
import { services } from "../services/serviceProvider";
import { canAccess } from "./canAccess";
import type { ModuleKey, PermissionKey, UserRecord } from "../shared/types/domain";
import type { UserRole } from "../types/user";

type GuardState = "checking" | "allowed" | "denied";

type ModuleGuardProps = {
  module: ModuleKey;
  permission?: PermissionKey;
  roles?: UserRole[];
  children: ReactNode;
};

export function ModuleGuard({ module, permission = "view", roles, children }: ModuleGuardProps) {
  const [state, setState] = useState<GuardState>("checking");
  const roleKey = roles?.join(",");

  useEffect(() => {
    let mounted = true;
    Promise.all([services.auth.getCurrentAuthContext(), services.auth.getCurrentUser()])
      .then((context) => {
        const [authContext, user] = context;
        const scopedUser: UserRecord = {
          ...user,
          modules: authContext.enabledModules as ModuleKey[],
          permissions: authContext.allowedPermissions as unknown as PermissionKey[],
        };
        const roleAllows = !roles || roles.includes(authContext.role_key);
        const accessAllows = canAccess(scopedUser, module, permission, authContext.enabledModules as ModuleKey[]);
        if (mounted) setState(roleAllows && accessAllows ? "allowed" : "denied");
      })
      .catch(() => {
        if (mounted) setState("denied");
      });
    return () => { mounted = false; };
  }, [module, permission, roleKey]);

  if (state === "checking") return <LoadingSkeleton rows={2} />;
  return state === "allowed" ? <>{children}</> : <Navigate to="/login" replace />;
}
