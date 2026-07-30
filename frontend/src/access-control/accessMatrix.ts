import { mockRoles } from "../mocks/roles.mock";
import type { ModuleKey, PermissionKey } from "../shared/types/domain";
import type { UserRole } from "../types/user";

export const accessMatrix: Record<UserRole, { modules: ModuleKey[]; permissions: PermissionKey[] }> = mockRoles.reduce((acc, role) => ({ ...acc, [role.id]: { modules: role.defaultModules, permissions: role.defaultPermissions } }), {} as Record<UserRole, { modules: ModuleKey[]; permissions: PermissionKey[] }>);
