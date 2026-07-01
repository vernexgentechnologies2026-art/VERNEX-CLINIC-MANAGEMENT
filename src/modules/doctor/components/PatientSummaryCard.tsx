import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui";
import type { PatientProfile } from "../types";
import { PatientTagBadge } from "./StatusBadge";

export function PatientSummaryCard({ patient, compact = false }: { patient: PatientProfile; compact?: boolean }) {
  return <div className="card p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-400">{patient.id}</p><h2 className="font-['Manrope'] text-xl font-extrabold">{patient.name}</h2><p className="text-sm text-slate-500">{patient.age} yrs · {patient.gender} · {patient.phone}</p></div><Link to={`/doctor/consultation/${patient.id}`}><Button className="min-h-9 px-3 py-1">Start Consultation</Button></Link></div><div className="mt-3 flex flex-wrap gap-2">{patient.tags.map((tag) => <PatientTagBadge key={tag} tag={tag} />)}{patient.pendingPayment && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Pending payment</span>}</div><div className="mt-4 grid gap-3 text-sm"><p><b>Blood group:</b> {patient.bloodGroup}</p><p><b>Last visit:</b> {patient.lastVisit}</p>{patient.allergies.length > 0 && <p className="rounded-xl bg-rose-50 p-3 font-semibold text-rose-700"><AlertTriangle className="mr-2 inline size-4" />Allergy Alert: {patient.allergies.join(", ")}</p>}{!compact && <><p><b>Existing conditions:</b> {patient.conditions.join(", ")}</p><p><b>Current medicines:</b> {patient.medications.join(", ")}</p><p><b>Emergency:</b> {patient.emergencyContact}</p><p><b>Total visits:</b> {patient.totalVisits}</p></>}</div></div>;
}
