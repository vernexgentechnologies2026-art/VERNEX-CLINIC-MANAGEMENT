import { useState } from "react";
import { getPatientPrescriptions } from "../../../services/patientPortal.service";
import { PatientEmptyState } from "../components/PatientEmptyState";
import { PrescriptionCard } from "../components/PrescriptionCard";
import { PrescriptionDetailModal } from "../components/PrescriptionDetailModal";
import type { PatientPrescription } from "../types";

export default function MyPrescriptions() {
  const prescriptions = getPatientPrescriptions();
  const [selected, setSelected] = useState<PatientPrescription | null>(null);
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">My Prescriptions</h1><p className="text-sm text-slate-500">View prescription details and download placeholders.</p></div>{prescriptions.length === 0 ? <PatientEmptyState title="No prescriptions yet" description="Your prescriptions will appear here after consultation." /> : <div className="space-y-3">{prescriptions.map((prescription) => <PrescriptionCard key={prescription.id} prescription={prescription} onView={setSelected} />)}</div>}<PrescriptionDetailModal prescription={selected} onClose={() => setSelected(null)} /></div>;
}
