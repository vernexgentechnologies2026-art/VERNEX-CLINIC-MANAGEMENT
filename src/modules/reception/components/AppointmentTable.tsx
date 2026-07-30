import { Button } from "../../../components/ui";
import type { Appointment } from "../types";
import { sourceLabel } from "../utils";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentStatusBadge, PaymentStatusBadge } from "./AppointmentStatusBadge";

export function AppointmentTable({ appointments }: { appointments: Appointment[] }) {
  return <><div className="grid gap-3 md:hidden">{appointments.map((a) => <AppointmentCard key={a.id} appointment={a} />)}</div><div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Time</th><th>Token</th><th>Patient</th><th>Phone</th><th>Doctor</th><th>Service</th><th>Source</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>{appointments.map((a) => <tr key={a.id}><td className="font-semibold">{a.time}</td><td><span className="rounded-lg bg-slate-100 px-2 py-1 font-bold">{a.token}</span></td><td className="font-semibold">{a.patientName}</td><td>{a.phone}</td><td>{a.doctorName}</td><td>{a.service}</td><td>{sourceLabel[a.source]}</td><td><AppointmentStatusBadge status={a.status} /></td><td><PaymentStatusBadge status={a.paymentStatus} /></td><td><div className="flex flex-wrap gap-2"><Button variant="secondary" className="min-h-8 px-3 py-1">Arrived</Button><Button variant="secondary" className="min-h-8 px-3 py-1">Queue</Button><Button variant="ghost" className="min-h-8 px-3 py-1">More</Button></div></td></tr>)}</tbody></table></div></>;
}
