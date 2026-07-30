import { Button } from "../../../components/ui";
import type { BookingService } from "../types";
import { rupee } from "../utils";

export function ServiceSelector({ services, selectedId, onSelect }: { services: BookingService[]; selectedId: string; onSelect: (id: string) => void }) {
  return <div className="grid gap-3 md:grid-cols-2">{services.map((service) => <button key={service.id} onClick={() => onSelect(service.id)} className={`min-h-32 rounded-card border bg-white p-4 text-left transition ${selectedId === service.id ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20" : "hover:border-brand-300 hover:bg-slate-50"}`}><h3 className="font-bold text-slate-950">{service.name}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{service.description}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm text-slate-500">{service.duration} - <b className="text-slate-900">{rupee(service.price)}</b></span><Button size="sm">{selectedId === service.id ? "Selected" : "Select"}</Button></div></button>)}</div>;
}
