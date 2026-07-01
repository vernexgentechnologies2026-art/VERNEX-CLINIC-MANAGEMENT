import { CalendarDays, MapPin } from "lucide-react";
import { Button, Card } from "../../../components/ui";
import type { PatientAppointment } from "../types";
import { labelFromValue } from "../utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function UpcomingAppointmentCard({ appointment }: { appointment: PatientAppointment }) {
  return <Card className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-brand-700">Next Appointment</p><h2 className="mt-1 text-xl font-bold">{appointment.doctorName}</h2><p className="text-sm text-slate-500">{appointment.service}</p></div><PatientStatusBadge status={appointment.status} /></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p className="flex gap-2"><CalendarDays className="size-4 text-brand-600" />{appointment.dateTime}</p><p className="font-semibold">Token {appointment.tokenNumber}</p><p className="text-slate-500">{appointment.clinicName}</p><p className="flex gap-2 text-slate-500"><MapPin className="size-4" />{appointment.clinicAddress}</p></div><div className="mt-4 flex flex-wrap gap-2"><Button>View details</Button><Button variant="secondary">Contact Clinic</Button><Button variant="ghost">Source: {labelFromValue(appointment.source)}</Button></div></Card>;
}
