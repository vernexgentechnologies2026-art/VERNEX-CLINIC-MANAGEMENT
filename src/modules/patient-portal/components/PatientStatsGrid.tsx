import { CalendarDays, FileHeart, ReceiptIndianRupee, Bell, Pill } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PatientDashboardSummary } from "../types";

export function PatientStatsGrid({ summary }: { summary: PatientDashboardSummary }) {
  const cards: [string, number, LucideIcon][] = [
    ["Upcoming", summary.upcomingAppointments, CalendarDays],
    ["Prescriptions", summary.activePrescriptions, FileHeart],
    ["Pending Bills", summary.pendingBills, ReceiptIndianRupee],
    ["Follow-ups", summary.followUpsDue, Bell],
    ["Medicines Today", summary.medicineRemindersToday, Pill]
  ];
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{cards.map(([label, value, Icon]) => <div key={String(label)} className="rounded-2xl bg-white p-4 shadow-card"><Icon className="size-5 text-brand-600" /><p className="mt-3 text-2xl font-bold">{String(value)}</p><p className="text-xs font-semibold text-slate-500">{String(label)}</p></div>)}</div>;
}
