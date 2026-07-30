import type { PermissionKey, UserRecord } from "../shared/types/domain";

export function usePermissions(user?: UserRecord | null) {
  return { permissions: user?.permissions ?? [], can: (permission: PermissionKey) => Boolean(user?.permissions.includes(permission)) };
}
