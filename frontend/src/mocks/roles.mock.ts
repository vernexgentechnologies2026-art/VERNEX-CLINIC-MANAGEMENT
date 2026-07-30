import type { RoleRecord } from "../shared/types/domain";

export const mockRoles: RoleRecord[] = [
  { id: "super_admin", label: "Super Admin", defaultModules: ["dashboard", "support", "settings", "subscription", "reports"], defaultPermissions: ["view", "create", "edit", "manage", "configure", "export"] },
  { id: "owner", label: "Owner", defaultModules: ["dashboard", "appointments", "patients", "pharmacy", "billing", "reports", "staff", "settings", "subscription", "support", "whatsapp"], defaultPermissions: ["view", "create", "edit", "approve", "cancel", "bill", "export", "manage", "configure"] },
  { id: "receptionist", label: "Receptionist", defaultModules: ["dashboard", "appointments", "patients", "billing", "whatsapp", "support"], defaultPermissions: ["view", "create", "edit", "assign", "cancel", "bill"] },
  { id: "doctor", label: "Doctor", defaultModules: ["appointments", "patients", "consultation", "prescriptions", "availability", "reminders", "follow_ups"], defaultPermissions: ["view", "create", "edit", "configure"] },
  { id: "pharmacist", label: "Pharmacist", defaultModules: ["pharmacy", "prescriptions", "billing", "delivery", "support"], defaultPermissions: ["view", "edit", "bill", "dispense", "manage"] }
];
