import type { ModuleKey } from "../shared/types/domain";

export const mockModules: { key: ModuleKey; label: string; description: string }[] = [
  { key: "dashboard", label: "Dashboard", description: "Role-specific summary and KPIs" },
  { key: "appointments", label: "Appointments", description: "Booking, queue, and schedule workflows" },
  { key: "whatsapp", label: "WhatsApp", description: "WhatsApp booking and conversations" },
  { key: "patients", label: "Patients", description: "Clinical patient records" },
  { key: "consultation", label: "Consultation", description: "Doctor consultation workspace" },
  { key: "prescriptions", label: "Prescriptions", description: "Prescription creation and delivery" },
  { key: "pharmacy", label: "Pharmacy", description: "Dispensing, billing, and stock" },
  { key: "billing", label: "Billing", description: "Invoices, receipts, payments, refunds" },
  { key: "reports", label: "Reports", description: "Clinic analytics and exports" },
  { key: "staff", label: "Staff", description: "Users, roles, modules, and permissions" },
  { key: "settings", label: "Settings", description: "Clinic and platform configuration" },
  { key: "subscription", label: "Subscription", description: "Plans and billing status" },
  { key: "support", label: "Support", description: "Support ticket panel" },
  { key: "delivery", label: "Delivery", description: "Medicine delivery placeholder" },
  { key: "availability", label: "Availability", description: "Doctor schedule and slot configuration" },
  { key: "reminders", label: "Reminders", description: "Medicine and appointment reminders" },
  { key: "follow_ups", label: "Follow-ups", description: "Doctor follow-up reminders" }
];
