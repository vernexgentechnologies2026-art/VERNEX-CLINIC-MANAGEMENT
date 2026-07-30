import { Ban, CalendarDays, CheckCircle2, Stethoscope, Users, WalletCards } from "lucide-react";
import { StatsCard } from "../../../components/ui";
import type { ReceptionStats } from "../types";

export function ReceptionStatsGrid({ stats }: { stats: ReceptionStats }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
    <StatsCard label="Today Appointments" value={String(stats.todayAppointments)} detail="31 confirmed" icon={CalendarDays} tone="blue" />
    <StatsCard label="Waiting Patients" value={String(stats.waitingPatients)} detail="14 min avg" icon={Users} tone="amber" />
    <StatsCard label="In Consultation" value={String(stats.inConsultation)} detail="Live now" icon={Stethoscope} tone="violet" />
    <StatsCard label="Completed" value={String(stats.completed)} detail="47% of schedule" icon={CheckCircle2} />
    <StatsCard label="Cancelled / No-show" value={String(stats.cancelledNoShow)} detail="Needs follow-up" icon={Ban} tone="violet" />
    <StatsCard label="Pending Bills" value={String(stats.pendingBills)} detail="Collect before exit" icon={WalletCards} tone="amber" />
  </div>;
}
