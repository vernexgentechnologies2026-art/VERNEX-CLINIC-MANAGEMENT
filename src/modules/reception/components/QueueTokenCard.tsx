import { Button } from "../../../components/ui";
import type { QueueItem } from "../types";
import { ageGender } from "../utils";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

export function QueueTokenCard({ item }: { item: QueueItem }) {
  return <div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Token #{item.token}</p><h3 className="mt-1 font-['Manrope'] text-lg font-extrabold">{item.patientName}</h3><p className="text-xs text-slate-500">{ageGender(item.age, item.gender)}</p></div><AppointmentStatusBadge status={item.status} /></div><div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm"><p className="font-semibold">{item.doctorName}</p><p className="text-slate-500">{item.service} · {item.reason}</p><p className="mt-2 text-xs font-bold text-amber-600">{item.waitingMinutes} mins waiting · Arrived {item.arrivalTime}</p></div><div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" className="min-h-8 px-3 py-1">Mark Arrived</Button><Button className="min-h-8 px-3 py-1">Send to Doctor</Button><Button variant="ghost" className="min-h-8 px-3 py-1">No-show</Button></div></div>;
}
