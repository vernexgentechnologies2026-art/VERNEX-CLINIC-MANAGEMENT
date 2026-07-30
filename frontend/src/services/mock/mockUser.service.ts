import { mockResolve } from "../../mocks/mockConfig";
import { mockUsers } from "../../mocks/users.mock";
import type { PermissionKey } from "../../shared/types/domain";
import type { UserService } from "../interfaces";

export const mockUserService: UserService = {
  getUsers: (clinicId) => mockResolve(clinicId ? mockUsers.filter((user) => user.clinicId === clinicId) : mockUsers),
  getUserById: (id) => mockResolve(mockUsers.find((user) => user.id === id) ?? mockUsers[0]),
  getStaffUsers: (clinicId) => mockResolve(clinicId ? mockUsers.filter((user) => user.clinicId === clinicId) : mockUsers),
  getStaffUserById: (id) => mockResolve(mockUsers.find((user) => user.id === id) ?? mockUsers[0]),
  createStaffProfile: (input) => mockResolve({ ...mockUsers[0], id: input.id, fullName: input.full_name, userId: input.user_id, email: input.email ?? "", phone: input.phone ?? "", role: input.role_key as never, clinicId: input.clinic_id ?? undefined, branchIds: input.branch_id ? [input.branch_id] : [], status: input.status as never }),
  updateStaffProfile: (id, input) => mockResolve({ ...(mockUsers.find((user) => user.id === id) ?? mockUsers[0]), fullName: input.full_name ?? mockUsers[0].fullName }),
  updateStaffStatus: (id, status) => mockResolve({ ...(mockUsers.find((user) => user.id === id) ?? mockUsers[0]), status: status as never }),
  assignStaffModules: (_staffId, modules) => mockResolve(modules),
  assignStaffPermissions: (_staffId, permissions) => mockResolve(permissions),
  getStaffModules: (staffId) => mockResolve((mockUsers.find((user) => user.id === staffId) ?? mockUsers[0]).modules),
  getStaffPermissions: (staffId) => mockResolve((mockUsers.find((user) => user.id === staffId) ?? mockUsers[0]).permissions),
  updateUserPermissions: (id, permissions: PermissionKey[]) => mockResolve({ ...(mockUsers.find((user) => user.id === id) ?? mockUsers[0]), permissions })
};
