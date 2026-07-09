import type { UserRecord } from "../../shared/types/domain";
import type { UserRole } from "../../types/user";

export interface AuthService {
  getCurrentUser(role?: UserRole): Promise<UserRecord>;
  loginAsRole(role: UserRole): Promise<UserRecord>;
  logout(): Promise<void>;
}
