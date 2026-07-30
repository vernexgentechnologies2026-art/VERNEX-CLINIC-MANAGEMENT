import type { PermissionKey, UserRecord } from "../../shared/types/domain";

export interface UserService {
  getUsers(clinicId?: string): Promise<UserRecord[]>;
  getUserById(id: string): Promise<UserRecord>;
  updateUserPermissions(id: string, permissions: PermissionKey[]): Promise<UserRecord>;
}
