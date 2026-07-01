import { Activity, BadgeIndianRupee, Bell, Building2, CalendarDays, ChartNoAxesCombined, ClipboardList, FileHeart, Headphones, LayoutDashboard, MessageCircle, Package, Pill, ReceiptIndianRupee, Settings, Stethoscope, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "../../types/user";
export type NavItem = { label: string; path: string; icon: LucideIcon };
export const homeForRole: Record<UserRole, string> = { owner: "/owner/dashboard", receptionist: "/reception/dashboard", doctor: "/doctor/queue", pharmacist: "/pharmacy/dashboard", patient: "/patient/dashboard", super_admin: "/super-admin/dashboard" };
export const navForRole: Record<UserRole, NavItem[]> = {
  owner: [
    { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays },
    { label: "Patients", path: "/owner/patients", icon: Users }, { label: "Doctors", path: "/owner/doctors", icon: Stethoscope },
    { label: "Staff", path: "/owner/staff", icon: UserPlus }, { label: "Pharmacy", path: "/pharmacy/dashboard", icon: Pill },
    { label: "Billing", path: "/billing/dashboard", icon: BadgeIndianRupee }, { label: "Reports", path: "/billing/reports", icon: ChartNoAxesCombined },
    { label: "WhatsApp Booking", path: "/whatsapp-booking/dashboard", icon: MessageCircle },
    { label: "Settings", path: "/owner/settings", icon: Settings }, { label: "Subscription", path: "/owner/subscription", icon: ReceiptIndianRupee }
  ],
  receptionist: [
    { label: "Reception Dashboard", path: "/reception/dashboard", icon: LayoutDashboard }, { label: "Appointments", path: "/reception/appointments", icon: CalendarDays },
    { label: "Queue", path: "/reception/queue", icon: ClipboardList }, { label: "New Patient", path: "/reception/new-patient", icon: UserPlus },
    { label: "Billing", path: "/reception/billing", icon: BadgeIndianRupee }, { label: "Receipts", path: "/billing/receipts", icon: ReceiptIndianRupee },
    { label: "WhatsApp Booking", path: "/whatsapp-booking/dashboard", icon: MessageCircle }
  ],
  doctor: [
    { label: "Doctor Queue", path: "/doctor/queue", icon: ClipboardList }, { label: "Patient Profile", path: "/doctor/patient/p1", icon: Users },
    { label: "Consultation", path: "/doctor/consultation/p1", icon: Stethoscope }, { label: "Prescription", path: "/doctor/prescription/p1", icon: FileHeart },
    { label: "Follow-ups", path: "/doctor/follow-ups", icon: CalendarDays }
  ],
  pharmacist: [
    { label: "Pharmacy Dashboard", path: "/pharmacy/dashboard", icon: LayoutDashboard }, { label: "Prescription Queue", path: "/pharmacy/prescriptions", icon: ClipboardList },
    { label: "Medicine Stock", path: "/pharmacy/stock", icon: Package }, { label: "Pharmacy Billing", path: "/pharmacy/billing", icon: BadgeIndianRupee },
    { label: "Purchase Entry", path: "/pharmacy/purchase-entry", icon: ReceiptIndianRupee }, { label: "Low Stock", path: "/pharmacy/low-stock", icon: Activity },
    { label: "Expiry Alerts", path: "/pharmacy/expiry-alerts", icon: Package }
  ],
  patient: [
    { label: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard }, { label: "Appointments", path: "/patient/appointments", icon: CalendarDays },
    { label: "Prescriptions", path: "/patient/prescriptions", icon: FileHeart }, { label: "Bills", path: "/patient/bills", icon: ReceiptIndianRupee },
    { label: "Follow-ups", path: "/patient/follow-ups", icon: ClipboardList }, { label: "Medicine Reminders", path: "/patient/medicine-reminders", icon: Bell },
    { label: "Profile", path: "/patient/profile", icon: Users }, { label: "Family Members", path: "/patient/family", icon: UserPlus }
  ],
  super_admin: [
    { label: "All Clinics", path: "/super-admin/dashboard", icon: Building2 }, { label: "Subscriptions", path: "/super-admin/subscriptions", icon: ReceiptIndianRupee },
    { label: "Usage", path: "/super-admin/usage", icon: ChartNoAxesCombined }, { label: "Support", path: "/super-admin/support", icon: Headphones },
    { label: "System Settings", path: "/super-admin/settings", icon: Settings }
  ]
};
