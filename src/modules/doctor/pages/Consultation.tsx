import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { Button, Card, Input, PageHeader, Select, Textarea } from "../../../components/ui";
import { getPastPrescriptions, getPatientProfile, getPatientTimeline } from "../../../services/doctor.service";
import { ConsultationNotesForm } from "../components/ConsultationNotesForm";
import { DiagnosisSelector } from "../components/DiagnosisSelector";
import { FollowUpScheduler } from "../components/FollowUpScheduler";
import { PatientHistoryPanel } from "../components/PatientHistoryPanel";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { VitalsForm } from "../components/VitalsForm";

const schema = z.object({ mainComplaint: z.string().min(2, "Main complaint required"), diagnosis: z.string().min(2, "Diagnosis required") });
type FormValues = z.infer<typeof schema>;

export default function Consultation() {
  const { patientId } = useParams();
  const patient = getPatientProfile(patientId);
  const { register, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { mainComplaint: "Fever and throat pain", diagnosis: "Viral fever" } });
  return <div className="space-y-5"><PageHeader title="Consultation" description="Capture complaint, vitals, diagnosis, notes, and follow-up quickly." /><div className="grid gap-5 xl:grid-cols-[.62fr_1.1fr_.7fr]"><aside className="xl:sticky xl:top-24 xl:self-start"><PatientSummaryCard patient={patient} compact /></aside><main className="space-y-5"><Card className="p-5"><h2 className="font-bold">Chief Complaint / Symptoms</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-xs font-bold">Main complaint<Input className="mt-1" {...register("mainComplaint")} /></label><Input placeholder="Symptoms" defaultValue="Fever, sore throat" /><Input placeholder="Duration" defaultValue="2 days" /><Select><option>Mild</option><option selected>Moderate</option><option>Severe</option></Select><Textarea className="md:col-span-2" placeholder="Notes" /></div>{errors.mainComplaint && <p className="mt-2 text-xs text-rose-600">{errors.mainComplaint.message}</p>}</Card><VitalsForm /><DiagnosisSelector /><ConsultationNotesForm /><FollowUpScheduler /><div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-3"><Button>Save Draft</Button><Link to={`/doctor/prescription/${patient.id}`}><Button>Continue to Prescription</Button></Link><Button variant="secondary">Complete Without Prescription</Button><Button variant="ghost">Cancel</Button></div></main><aside className="xl:sticky xl:top-24 xl:self-start"><PatientHistoryPanel timeline={getPatientTimeline()} prescriptions={getPastPrescriptions()} /></aside></div></div>;
}
