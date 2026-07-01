import type { Prescription } from "../../types/prescription";
export function PrescriptionPreview({ prescription }: { prescription: Prescription }) { return <div className="card p-4"><p className="font-semibold">{prescription.id} · {prescription.patientName}</p><p className="mt-1 text-sm text-slate-500">{prescription.items.map(i => i.medicineName).join(", ")}</p></div>; }
