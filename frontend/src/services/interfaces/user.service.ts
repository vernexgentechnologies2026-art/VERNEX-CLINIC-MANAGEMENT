import type { PermissionKey, UserRecord } from "../../shared/types/domain";
import type { ModuleKey } from "../../shared/types/domain";
import type { TablesInsert, TablesUpdate } from "../../shared/types/database.types";

export interface UserService {
  getUsers(clinicId?: string): Promise<UserRecord[]>;
  getUserById(id: string): Promise<UserRecord>;
  getStaffUsers(clinicId?: string): Promise<UserRecord[]>;
  getStaffUserById(id: string): Promise<UserRecord>;
  createStaffProfile(input: TablesInsert<"staff_profiles">): Promise<UserRecord>;
  updateStaffProfile(id: string, input: TablesUpdate<"staff_profiles">): Promise<UserRecord>;
  updateStaffStatus(id: string, status: string): Promise<UserRecord>;
  assignStaffModules(staffId: string, modules: ModuleKey[]): Promise<ModuleKey[]>;
  assignStaffPermissions(staffId: string, permissions: string[]): Promise<string[]>;
  getStaffModules(staffId: string): Promise<ModuleKey[]>;
  getStaffPermissions(staffId: string): Promise<string[]>;
  updateUserPermissions(id: string, permissions: PermissionKey[]): Promise<UserRecord>;
}
