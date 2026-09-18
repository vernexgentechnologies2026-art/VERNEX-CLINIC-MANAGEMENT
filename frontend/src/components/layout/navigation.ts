import { Activity, BadgeIndianRupee, Building2, CalendarDays, ChartNoAxesCombined, ClipboardList, FileHeart, Headphones, LayoutDashboard, MessageCircle, Package, Pill, ReceiptIndianRupee, Settings, Stethoscope, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { canAccess } from "../../access-control/canAccess";
import type { ModuleKey, PermissionKey, UserRecord } from "../../shared/types/domain";
import type { UserRole } from "../../types/user";
export type NavItem = { label: string; path: string; icon: LucideIcon; module: ModuleKey; permission?: PermissionKey };
export const homeForRole: Record<UserRole, string> = { owner: "/owner/dashboard", admin: "/owner/dashboard", receptionist: "/reception/dashboard", doctor: "/doctor/queue", pharmacist: "/pharmacy/dashboard", super_admin: "/super-admin/dashboard" };
const ownerNav: NavItem[] = [
  { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard, module: "dashboard" }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays, module: "appointments" },
  { label: "Patients", path: "/reception/new-patient", icon: Users, module: "patients" },
  { label: "Reports", path: "/billing/reports", icon: ChartNoAxesCombined, module: "reports" },
  { label: "Monitoring", path: "/monitoring", icon: Activity, module: "reports" },
  { label: "Staff", path: "/owner/staff", icon: UserPlus, module: "staff", permission: "manage" },
  { label: "Settings", path: "/owner/settings", icon: Settings, module: "settings", permission: "configure" }
];
export const navForRole: Record<UserRole, NavItem[]> = {
  owner: ownerNav,
  admin: ownerNav,
  receptionist: [
    { label: "Reception Dashboard", path: "/reception/dashboard", icon: LayoutDashboard, module: "dashboard" }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays, module: "appointments" },
    { label: "Queue", path: "/reception/queue", icon: ClipboardList, module: "appointments" }, { label: "New Patient", path: "/reception/new-patient", icon: UserPlus, module: "patients", permission: "create" }
  ],
  doctor: [
    { label: "Queue", path: "/doctor/queue", icon: ClipboardList, module: "appointments" }, { label: "Availability", path: "/doctor/availability", icon: CalendarDays, module: "availability", permission: "configure" },
    { label: "Follow-ups", path: "/doctor/follow-ups", icon: Users, module: "follow_ups" }
  ],
  pharmacist: [
    { label: "Pharmacy Dashboard", path: "/pharmacy/dashboard", icon: LayoutDashboard, module: "pharmacy" },
    { label: "Medicine Stock", path: "/pharmacy/stock", icon: Package, module: "pharmacy", permission: "manage" },
    { label: "Purchase Entry", path: "/pharmacy/purchase-entry", icon: ReceiptIndianRupee, module: "pharmacy", permission: "manage" }, { label: "Low Stock", path: "/pharmacy/low-stock", icon: Activity, module: "pharmacy" },
    { label: "Expiry Alerts", path: "/pharmacy/expiry-alerts", icon: Package, module: "pharmacy" }
  ],
  super_admin: [
    { label: "All Clinics", path: "/super-admin/dashboard", icon: Building2, module: "dashboard" }, { label: "Subscriptions", path: "/super-admin/subscriptions", icon: ReceiptIndianRupee, module: "subscription" },
    { label: "Usage", path: "/super-admin/usage", icon: ChartNoAxesCombined, module: "reports" }, { label: "Monitoring", path: "/monitoring", icon: Activity, module: "reports" }, { label: "Support", path: "/super-admin/support", icon: Headphones, module: "support" },
    { label: "System Settings", path: "/super-admin/settings", icon: Settings, module: "settings", permission: "configure" }
  ]
};
export function getNavigationForUser(user: UserRecord, enabledClinicModules: ModuleKey[] = [], userModules: ModuleKey[] = user.modules, permissions: PermissionKey[] = user.permissions) {
  const scopedUser = { ...user, modules: userModules, permissions };
  return navForRole[user.role].filter((item) => canAccess(scopedUser, item.module, item.permission ?? "view", enabledClinicModules));
}
