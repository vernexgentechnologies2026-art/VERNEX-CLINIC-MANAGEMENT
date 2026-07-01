import { Link } from "react-router-dom";
import { Button } from "../../../components/ui";
import type { DoctorQueueItem } from "../types";
import { ageGender } from "../utils";
import { PatientTagBadge, QueueStatusBadge } from "./StatusBadge";

export function DoctorQueueCard({ item }: { item: DoctorQueueItem }) {
  return <div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Token {item.token}</p><h3 className="mt-1 font-['Manrope'] text-lg font-extrabold">{item.patientName}</h3><p className="text-xs text-slate-500">{ageGender(item.age, item.gender)} · {item.source}</p></div><QueueStatusBadge status={item.status} /></div><p className="mt-3 text-sm text-slate-700">{item.reason}</p><div className="mt-3 flex flex-wrap gap-2">{item.previousVisit && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">Previous Visit</span>}{item.tags.map((tag) => <PatientTagBadge key={tag} tag={tag} />)}</div><p className="mt-3 text-xs font-bold text-amber-600">{item.waitingMinutes} mins waiting</p><div className="mt-4 flex flex-wrap gap-2"><Link to={`/doctor/consultation/${item.patientId}`}><Button>Start Consultation</Button></Link><Link to={`/doctor/patient/${item.patientId}`}><Button variant="secondary">View Profile</Button></Link><Link to={`/doctor/prescription/${item.patientId}`}><Button variant="ghost">Previous Rx</Button></Link></div></div>;
}
