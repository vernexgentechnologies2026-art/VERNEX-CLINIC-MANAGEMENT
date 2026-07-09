import type { ModuleKey, PermissionKey, UserRecord } from "../shared/types/domain";
import { accessMatrix } from "./accessMatrix";

export function canAccess(user: UserRecord | null | undefined, module: ModuleKey, permission: PermissionKey = "view", enabledClinicModules: ModuleKey[] = []) {
  if (!user) return false;
  const roleDefaults = accessMatrix[user.role];
  const clinicAllows = enabledClinicModules.length === 0 || enabledClinicModules.includes(module) || user.role === "super_admin";
  const moduleAllows = user.modules.includes(module) || roleDefaults.modules.includes(module);
  const permissionAllows = user.permissions.includes(permission) || roleDefaults.permissions.includes(permission);
  return clinicAllows && moduleAllows && permissionAllows;
}
