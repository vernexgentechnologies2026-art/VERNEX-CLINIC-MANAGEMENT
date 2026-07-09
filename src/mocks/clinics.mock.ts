import type { ClinicRecord } from "../shared/types/domain";

// Clinics own branches, users, appointments, invoices, and module entitlements.
export const mockClinics: ClinicRecord[] = [
  { id: "clinic-vernex", name: "Vernex Multispeciality Clinic", slug: "vernex-clinic", planId: "plan-growth", status: "active", ownerUserId: "user-owner-1", enabledModules: ["dashboard", "appointments", "whatsapp", "patients", "consultation", "prescriptions", "pharmacy", "billing", "reports", "staff", "settings", "subscription", "support", "availability", "reminders", "follow_ups"], address: "12, 5th Main Road, Indiranagar", phone: "+91 98765 43210", city: "Bengaluru", state: "Karnataka", gstin: "29AABCV1234F1Z5" },
  { id: "clinic-small", name: "Kavya Skin & Hair Clinic", slug: "kavya-skin-hair", planId: "plan-starter", status: "trial", ownerUserId: "user-doctor-owner", enabledModules: ["dashboard", "appointments", "whatsapp", "patients", "consultation", "prescriptions", "billing", "reports", "availability", "reminders"], address: "8, Anna Nagar Main Road", phone: "+91 91234 56780", city: "Chennai", state: "Tamil Nadu" }
];
