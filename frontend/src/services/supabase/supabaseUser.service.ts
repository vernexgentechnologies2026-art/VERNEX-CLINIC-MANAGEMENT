import { supabase } from "../../lib/supabaseClient";
import type { EntityStatus, ModuleKey, PermissionKey, UserRecord } from "../../shared/types/domain";
import type { Tables } from "../../shared/types/database.types";
import type { UserRole } from "../../types/user";
import type { UserService } from "../interfaces";

type StaffRow = Tables<"staff_profiles">;

function asRole(role: string): UserRole {
  return role as UserRole;
}

function permissionActions(permissionKeys: string[]): PermissionKey[] {
  return Array.from(new Set(permissionKeys.map((key) => key.split(".").pop()).filter(Boolean))) as PermissionKey[];
}

async function getStaffModules(staffId: string) {
  const { data, error } = await supabase.from("staff_modules").select("module_key").eq("staff_id", staffId).eq("enabled", true);
  if (error) throw error;
  return (data ?? []).map((item) => item.module_key as ModuleKey);
}

async function getStaffPermissions(staffId: string) {
  const { data, error } = await supabase.from("staff_permissions").select("permission_key").eq("staff_id", staffId).eq("allowed", true);
  if (error) throw error;
  return (data ?? []).map((item) => item.permission_key);
}

async function getRoleModules(roleKey: string) {
  const { data, error } = await supabase.from("role_modules").select("module_key").eq("role_key", roleKey).eq("enabled", true);
  if (error) throw error;
  return (data ?? []).map((item) => item.module_key as ModuleKey);
}

async function getRolePermissions(roleKey: string) {
  const { data, error } = await supabase.from("role_permissions").select("permission_key").eq("role_key", roleKey).eq("allowed", true);
  if (error) throw error;
  return (data ?? []).map((item) => item.permission_key);
}

async function mapStaff(row: StaffRow): Promise<UserRecord> {
  const staffModules = await getStaffModules(row.id);
  const staffPermissions = await getStaffPermissions(row.id);
  const modules = staffModules.length > 0 ? staffModules : await getRoleModules(row.role_key);
  const permissionKeys = staffPermissions.length > 0 ? staffPermissions : await getRolePermissions(row.role_key);

  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    role: asRole(row.role_key),
    clinicId: row.clinic_id ?? undefined,
    branchIds: row.branch_id ? [row.branch_id] : [],
    modules,
    permissions: permissionActions(permissionKeys),
    status: row.status as EntityStatus,
  };
}

export const supabaseUserService: UserService = {
  async getUsers(clinicId) {
    return this.getStaffUsers(clinicId);
  },

  async getUserById(id) {
    return this.getStaffUserById(id);
  },

  async getStaffUsers(clinicId) {
    let query = supabase.from("staff_profiles").select("*").order("created_at", { ascending: false });
    if (clinicId) query = query.eq("clinic_id", clinicId);
    const { data, error } = await query;
    if (error) throw error;
    return Promise.all((data ?? []).map(mapStaff));
  },

  async getStaffUserById(id) {
    const { data, error } = await supabase.from("staff_profiles").select("*").eq("id", id).single();
    if (error) throw error;
    return mapStaff(data);
  },

  async createStaffProfile(input) {
    const { data, error } = await supabase.from("staff_profiles").insert(input).select("*").single();
    if (error) throw error;
    return mapStaff(data);
  },

  async updateStaffProfile(id, input) {
    const { data, error } = await supabase.from("staff_profiles").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return mapStaff(data);
  },

  async updateStaffStatus(id, status) {
    const { data, error } = await supabase.from("staff_profiles").update({ status }).eq("id", id).select("*").single();
    if (error) throw error;
    return mapStaff(data);
  },

  async assignStaffModules(staffId, modules) {
    const { error: deleteError } = await supabase.from("staff_modules").delete().eq("staff_id", staffId);
    if (deleteError) throw deleteError;
    if (modules.length > 0) {
      const { error } = await supabase.from("staff_modules").insert(modules.map((module_key) => ({ staff_id: staffId, module_key, enabled: true })));
      if (error) throw error;
    }
    return modules;
  },

  async assignStaffPermissions(staffId, permissions) {
    const { error: deleteError } = await supabase.from("staff_permissions").delete().eq("staff_id", staffId);
    if (deleteError) throw deleteError;
    if (permissions.length > 0) {
      const { error } = await supabase.from("staff_permissions").insert(permissions.map((permission_key) => ({ staff_id: staffId, permission_key, allowed: true })));
      if (error) throw error;
    }
    return permissions;
  },

  getStaffModules,
  getStaffPermissions,

  async updateUserPermissions(id, permissions) {
    const existingModules = await getStaffModules(id);
    const permissionKeys = existingModules.flatMap((module) => permissions.map((permission) => `${module}.${permission}`));
    await this.assignStaffPermissions(id, permissionKeys);
    return this.getStaffUserById(id);
  },
};
