import { Button } from "../../../components/ui";
import type { BookingDoctor } from "../types";
import { rupee } from "../utils";

export function DoctorSelector({ doctors, selectedId, onSelect }: { doctors: BookingDoctor[]; selectedId: string; onSelect: (id: string) => void }) {
  return <div className="grid gap-3 md:grid-cols-2">{doctors.map((doctor) => <button key={doctor.id} disabled={!doctor.availableToday} onClick={() => onSelect(doctor.id)} className={`min-h-36 rounded-card border bg-white p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${selectedId === doctor.id ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "hover:border-brand-300 hover:bg-slate-50"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-950">{doctor.name}</h3><p className="text-sm text-slate-500">{doctor.specialization}</p><p className="mt-1 text-xs text-slate-400">{doctor.qualification} - {doctor.experience} yrs</p></div>{doctor.availableToday && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Available today</span>}</div><div className="mt-4 flex items-center justify-between"><b>{rupee(doctor.consultationFee)}</b><Button size="sm">{selectedId === doctor.id ? "Selected" : "Select"}</Button></div></button>)}</div>;
}
