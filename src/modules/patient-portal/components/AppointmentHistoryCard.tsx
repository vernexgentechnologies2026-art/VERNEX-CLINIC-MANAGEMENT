import { Button, Card } from "../../../components/ui";
import type { PatientAppointment } from "../types";
import { labelFromValue } from "../utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function AppointmentHistoryCard({ appointment }: { appointment: PatientAppointment }) {
  return <Card className="p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-bold">{appointment.doctorName}</h3><p className="text-sm text-slate-500">{appointment.service}</p><p className="mt-2 text-sm font-semibold">{appointment.dateTime}</p><p className="text-xs text-slate-500">Token {appointment.tokenNumber} • {labelFromValue(appointment.source)}</p><p className="mt-2 text-xs text-slate-500">{appointment.clinicAddress}</p></div><PatientStatusBadge status={appointment.status} /></div><div className="mt-4 grid gap-2 sm:grid-cols-4"><Button>View details</Button><Button variant="secondary">Reschedule</Button><Button variant="secondary">Book Follow-up</Button><Button variant="ghost">Cancel</Button></div></Card>;
}
