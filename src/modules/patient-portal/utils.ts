import type { MedicineReminderStatus, PatientAppointmentStatus, PatientBillStatus, PatientFollowUpStatus } from "./types";

export const formatInr = (amount: number) => `INR ${amount.toLocaleString("en-IN")}`;

export const labelFromValue = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const statusClass = (status: PatientAppointmentStatus | PatientBillStatus | PatientFollowUpStatus | MedicineReminderStatus) => {
  if (["confirmed", "completed", "paid", "taken"].includes(status)) return "bg-emerald-50 text-emerald-700";
  if (["pending", "partial", "booked", "upcoming", "due_today", "snoozed", "arrived"].includes(status)) return "bg-amber-50 text-amber-700";
  if (["cancelled", "no_show", "overdue", "missed"].includes(status)) return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-700";
};
