import type { AppointmentStatus, PaymentStatus } from "../types";
import { appointmentStatusLabel, paymentLabel } from "../utils";

const statusTone: Record<AppointmentStatus, string> = {
  booked: "bg-blue-50 text-blue-700",
  arrived: "bg-cyan-50 text-cyan-700",
  waiting: "bg-amber-50 text-amber-700",
  in_consultation: "bg-violet-50 text-violet-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
  no_show: "bg-slate-100 text-slate-600"
};

const paymentTone: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  partial: "bg-blue-50 text-blue-700"
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[status]}`}>{appointmentStatusLabel[status]}</span>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${paymentTone[status]}`}>{paymentLabel[status]}</span>;
}
