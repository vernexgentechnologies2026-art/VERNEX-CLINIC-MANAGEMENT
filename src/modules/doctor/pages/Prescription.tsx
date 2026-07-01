import { useParams } from "react-router-dom";
import { PageHeader } from "../../../components/ui";
import { getPatientProfile } from "../../../services/doctor.service";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { PrescriptionBuilder } from "../components/PrescriptionBuilder";

export default function Prescription() {
  const { patientId } = useParams();
  const patient = getPatientProfile(patientId);
  return <div className="space-y-5"><PageHeader title="Prescription" description="Build a digital prescription with favorites, templates, lab tests, preview, and sharing placeholders." /><PatientSummaryCard patient={patient} compact /><PrescriptionBuilder patient={patient} /></div>;
}
