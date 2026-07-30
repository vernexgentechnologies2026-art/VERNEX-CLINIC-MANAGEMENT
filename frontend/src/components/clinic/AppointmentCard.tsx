import type { Appointment } from "../../types/appointment";
import { Card } from "../common/Card";
import { StatusPill } from "../common/StatusPill";
export function AppointmentCard({ appointment }: { appointment: Appointment }) { return <Card className="flex items-center justify-between p-4"><div><p className="font-semibold">{appointment.patientName}</p><p className="text-xs text-slate-500">{appointment.time} · {appointment.doctorName}</p></div><StatusPill status={appointment.status}/></Card>; }
