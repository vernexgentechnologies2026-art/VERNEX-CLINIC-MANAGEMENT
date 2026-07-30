import { Activity, BadgeIndianRupee, Building2, CalendarDays, ChartNoAxesCombined, ClipboardList, FileHeart, Headphones, LayoutDashboard, MessageCircle, Package, Pill, ReceiptIndianRupee, Settings, Stethoscope, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { canAccess } from "../../access-control/canAccess";
import type { ModuleKey, PermissionKey, UserRecord } from "../../shared/types/domain";
import type { UserRole } from "../../types/user";
export type NavItem = { label: string; path: string; icon: LucideIcon; module: ModuleKey; permission?: PermissionKey };
export const homeForRole: Record<UserRole, string> = { owner: "/owner/dashboard", receptionist: "/reception/dashboard", doctor: "/doctor/queue", pharmacist: "/pharmacy/dashboard", super_admin: "/super-admin/dashboard" };
export const navForRole: Record<UserRole, NavItem[]> = {
  owner: [
    { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard, module: "dashboard" }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays, module: "appointments" },
    { label: "Patients", path: "/owner/patients", icon: Users, module: "patients" }, { label: "Doctors", path: "/owner/doctors", icon: Stethoscope, module: "staff" },
    { label: "Staff", path: "/owner/staff", icon: UserPlus, module: "staff", permission: "manage" }, { label: "Pharmacy", path: "/pharmacy/dashboard", icon: Pill, module: "pharmacy" },
    { label: "Billing", path: "/billing/dashboard", icon: BadgeIndianRupee, module: "billing" }, { label: "Reports", path: "/billing/reports", icon: ChartNoAxesCombined, module: "reports" },
    { label: "WhatsApp Booking", path: "/whatsapp-booking/dashboard", icon: MessageCircle, module: "whatsapp" },
    { label: "Settings", path: "/owner/settings", icon: Settings, module: "settings", permission: "configure" }, { label: "Subscription", path: "/owner/subscription", icon: ReceiptIndianRupee, module: "subscription" }
  ],
  receptionist: [
    { label: "Reception Dashboard", path: "/reception/dashboard", icon: LayoutDashboard, module: "dashboard" }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays, module: "appointments" },
    { label: "Queue", path: "/reception/queue", icon: ClipboardList, module: "appointments" }, { label: "New Patient", path: "/reception/new-patient", icon: UserPlus, module: "patients", permission: "create" },
    { label: "Billing", path: "/reception/billing", icon: BadgeIndianRupee, module: "billing", permission: "bill" }, { label: "WhatsApp Conversations", path: "/whatsapp-booking/conversations", icon: MessageCircle, module: "whatsapp" }
  ],
  doctor: [
    { label: "Queue", path: "/doctor/queue", icon: ClipboardList, module: "appointments" }, { label: "Availability", path: "/doctor/availability", icon: CalendarDays, module: "availability", permission: "configure" },
    { label: "Patient Records", path: "/doctor/patient/p1", icon: Users, module: "patients" }, { label: "Consultation", path: "/doctor/consultation/p1", icon: Stethoscope, module: "consultation" },
    { label: "Prescriptions", path: "/doctor/prescription/p1", icon: FileHeart, module: "prescriptions" }, { label: "Patient Reminders", path: "/doctor/patient-reminders", icon: MessageCircle, module: "reminders" },
    { label: "Follow-ups", path: "/doctor/follow-ups", icon: CalendarDays, module: "follow_ups" }
  ],
  pharmacist: [
    { label: "Pharmacy Dashboard", path: "/pharmacy/dashboard", icon: LayoutDashboard, module: "pharmacy" }, { label: "Prescription Queue", path: "/pharmacy/prescriptions", icon: ClipboardList, module: "prescriptions" },
    { label: "Medicine Stock", path: "/pharmacy/stock", icon: Package, module: "pharmacy", permission: "manage" }, { label: "Pharmacy Billing", path: "/pharmacy/billing", icon: BadgeIndianRupee, module: "billing", permission: "bill" },
    { label: "Purchase Entry", path: "/pharmacy/purchase-entry", icon: ReceiptIndianRupee, module: "pharmacy", permission: "manage" }, { label: "Low Stock", path: "/pharmacy/low-stock", icon: Activity, module: "pharmacy" },
    { label: "Expiry Alerts", path: "/pharmacy/expiry-alerts", icon: Package, module: "pharmacy" }
  ],
  super_admin: [
    { label: "All Clinics", path: "/super-admin/dashboard", icon: Building2, module: "dashboard" }, { label: "Subscriptions", path: "/super-admin/subscriptions", icon: ReceiptIndianRupee, module: "subscription" },
    { label: "Usage", path: "/super-admin/usage", icon: ChartNoAxesCombined, module: "reports" }, { label: "Support", path: "/super-admin/support", icon: Headphones, module: "support" },
    { label: "System Settings", path: "/super-admin/settings", icon: Settings, module: "settings", permission: "configure" }
  ]
};
export function getNavigationForUser(user: UserRecord, enabledClinicModules: ModuleKey[] = [], userModules: ModuleKey[] = user.modules, permissions: PermissionKey[] = user.permissions) {
  const scopedUser = { ...user, modules: userModules, permissions };
  return navForRole[user.role].filter((item) => canAccess(scopedUser, item.module, item.permission ?? "view", enabledClinicModules));
}
