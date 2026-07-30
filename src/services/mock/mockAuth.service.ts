import { mockUsers } from "../../mocks/users.mock";
import { mockResolve } from "../../mocks/mockConfig";
import type { AuthService } from "../interfaces";
import type { UserRole } from "../../types/user";

export const mockAuthService: AuthService = {
  getCurrentUser: (role = (localStorage.getItem("vernex_role") as UserRole) || "owner") => mockResolve(mockUsers.find((user) => user.role === role) ?? mockUsers[1]),
  loginAsRole: (role) => mockResolve(mockUsers.find((user) => user.role === role) ?? mockUsers[1]),
  logout: () => mockResolve(undefined)
};
