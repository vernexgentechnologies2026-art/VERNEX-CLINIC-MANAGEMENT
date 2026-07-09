import { mockResolve } from "../../mocks/mockConfig";
import { mockUsers } from "../../mocks/users.mock";
import type { PermissionKey } from "../../shared/types/domain";
import type { UserService } from "../interfaces";

export const mockUserService: UserService = {
  getUsers: (clinicId) => mockResolve(clinicId ? mockUsers.filter((user) => user.clinicId === clinicId) : mockUsers),
  getUserById: (id) => mockResolve(mockUsers.find((user) => user.id === id) ?? mockUsers[0]),
  updateUserPermissions: (id, permissions: PermissionKey[]) => mockResolve({ ...(mockUsers.find((user) => user.id === id) ?? mockUsers[0]), permissions })
};
