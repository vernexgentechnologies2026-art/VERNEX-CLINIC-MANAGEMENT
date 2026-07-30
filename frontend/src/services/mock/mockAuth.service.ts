import { mockUsers } from "../../mocks/users.mock";
import { mockResolve } from "../../mocks/mockConfig";
import type { AuthService } from "../interfaces";
import type { UserRole } from "../../types/user";

export const mockAuthService: AuthService = {
  signInWithPassword: (_userIdOrEmail, _password) => {
    const user = mockUsers[1];
    localStorage.setItem("vernex_role", user.role);
    localStorage.setItem("vernex_auth", "true");
    return mockResolve({
      authUserId: user.id,
      staffProfileId: user.id,
      fullName: user.fullName,
      user_id: user.userId,
      email: user.email,
      phone: user.phone,
      role_key: user.role,
      clinic_id: user.clinicId ?? null,
      branch_id: user.branchIds[0] ?? null,
      enabledModules: user.modules,
      allowedPermissions: user.permissions,
      status: user.status,
      clinic: null,
      branch: null,
      session: null,
    });
  },
  signOut: () => {
    localStorage.removeItem("vernex_auth");
    localStorage.removeItem("vernex_role");
    return mockResolve(undefined);
  },
  getSession: () => mockResolve(localStorage.getItem("vernex_auth") === "true" ? {} : null),
  getCurrentStaffProfile: (role = (localStorage.getItem("vernex_role") as UserRole) || "owner") => mockResolve(mockUsers.find((user) => user.role === role) ?? mockUsers[1]),
  getCurrentAuthContext: (role = (localStorage.getItem("vernex_role") as UserRole) || "owner") => {
    const user = mockUsers.find((item) => item.role === role) ?? mockUsers[1];
    return mockResolve({
      authUserId: user.id,
      staffProfileId: user.id,
      fullName: user.fullName,
      user_id: user.userId,
      email: user.email,
      phone: user.phone,
      role_key: user.role,
      clinic_id: user.clinicId ?? null,
      branch_id: user.branchIds[0] ?? null,
      enabledModules: user.modules,
      allowedPermissions: user.permissions,
      status: user.status,
      clinic: null,
      branch: null,
      session: null,
    });
  },
  getCurrentUser: (role = (localStorage.getItem("vernex_role") as UserRole) || "owner") => mockResolve(mockUsers.find((user) => user.role === role) ?? mockUsers[1]),
  loginAsRole: (role) => mockResolve(mockUsers.find((user) => user.role === role) ?? mockUsers[1]),
  logout: () => {
    localStorage.removeItem("vernex_auth");
    localStorage.removeItem("vernex_role");
    return mockResolve(undefined);
  }
};
