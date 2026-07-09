import { useState } from "react";
import { Button, ConfirmationDialog } from "../../../components/ui";
import type { QueueItem } from "../types";
import { ageGender } from "../utils";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

export function QueueTokenCard({ item }: { item: QueueItem }) {
  const [confirmNoShow, setConfirmNoShow] = useState(false);
  return <div className="rounded-card border bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Token #{item.token}</p><h3 className="mt-1 font-['Manrope'] text-lg font-extrabold text-slate-950">{item.patientName}</h3><p className="text-xs text-slate-500">{ageGender(item.age, item.gender)}</p></div><AppointmentStatusBadge status={item.status} /></div><div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold">{item.doctorName}</p><p className="text-slate-500">{item.service} - {item.reason}</p><p className="mt-2 text-xs font-bold text-amber-600">{item.waitingMinutes} mins waiting - Arrived {item.arrivalTime}</p></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><Button variant="secondary" size="sm">Mark Arrived</Button><Button size="sm">Send to Doctor</Button><Button variant="ghost" size="sm" onClick={() => setConfirmNoShow(true)}>No-show</Button></div><ConfirmationDialog open={confirmNoShow} title="Mark patient as no-show?" description={`${item.patientName} will be removed from the active queue lane.`} confirmLabel="Mark no-show" danger onCancel={() => setConfirmNoShow(false)} onConfirm={() => setConfirmNoShow(false)} /></div>;
}
