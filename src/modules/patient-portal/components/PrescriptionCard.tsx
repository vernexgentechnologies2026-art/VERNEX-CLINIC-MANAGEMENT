import { Button, Card } from "../../../components/ui";
import type { PatientPrescription } from "../types";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function PrescriptionCard({ prescription, onView }: { prescription: PatientPrescription; onView: (prescription: PatientPrescription) => void }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{prescription.doctorName}</h3><p className="text-sm text-slate-500">{prescription.diagnosis}</p><p className="mt-2 text-xs font-semibold text-slate-500">{prescription.date} • {prescription.medicines.length} medicines</p>{prescription.followUpDate && <p className="mt-1 text-xs text-brand-700">Follow-up: {prescription.followUpDate}</p>}</div><PatientStatusBadge status={prescription.status} /></div><div className="mt-4 grid gap-2 sm:grid-cols-4"><Button onClick={() => onView(prescription)}>View Prescription</Button><Button variant="secondary">Download PDF</Button><Button variant="secondary">Print</Button><Button variant="ghost">Send to WhatsApp</Button></div></Card>;
}
