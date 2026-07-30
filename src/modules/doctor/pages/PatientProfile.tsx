import { FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button, Card, PageHeader } from "../../../components/ui";
import { getPastPrescriptions, getPatientProfile, getPatientTimeline } from "../../../services/doctor.service";
import { PatientHistoryPanel } from "../components/PatientHistoryPanel";
import { PatientSummaryCard } from "../components/PatientSummaryCard";

export default function PatientProfile() {
  const { id } = useParams();
  const patient = getPatientProfile(id);
  const prescriptions = getPastPrescriptions();
  return <div className="space-y-5"><PageHeader title="Patient Profile" description="Clean clinical context before starting consultation." action={<Button>Start Consultation</Button>} /><div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]"><div className="space-y-5"><PatientSummaryCard patient={patient} /><Card className="p-5"><h2 className="font-bold">Uploaded Reports Placeholder</h2><div className="mt-3 grid gap-2 text-sm">{["Blood test report", "X-ray", "Scan report", "Other medical document"].map((r) => <div key={r} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><FileText className="size-4 text-slate-400" />{r}</div>)}</div></Card><Card className="p-5"><h2 className="font-bold">Doctor Notes</h2><p className="mt-2 text-sm text-slate-500">{patient.internalNotes}</p></Card></div><PatientHistoryPanel timeline={getPatientTimeline()} prescriptions={prescriptions} /></div></div>;
}
