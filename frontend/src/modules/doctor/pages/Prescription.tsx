import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../components/ui";
import { getPatientProfile } from "../../../services/doctor.service";
import { services } from "../../../services/serviceProvider";
import type { PatientRecord } from "../../../shared/types/domain";
import { PatientSummaryCard } from "../components/PatientSummaryCard";
import { PrescriptionBuilder } from "../components/PrescriptionBuilder";
import type { PatientProfile } from "../types";

export default function Prescription() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    let mounted = true;
    const loadPatient = async () => {
      setLoading(true);
      try {
        const nextPatient = await services.patients.getPatientById(patientId);
        if (mounted) setPatient(nextPatient);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load patient. Showing demo prescription context.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadPatient();
    return () => { mounted = false; };
  }, [patientId]);

  const patientProfile = useMemo(() => patient ? toPatientProfile(patient) : getPatientProfile(patientId), [patient, patientId]);

  return <div className="space-y-5"><PageHeader title="Prescription" description={loading ? "Loading patient prescription context..." : "Build a digital prescription with favorites, templates, lab tests, preview, and sharing placeholders."} /><PatientSummaryCard patient={patientProfile} compact /><PrescriptionBuilder patient={patientProfile} /></div>;
}

function toPatientProfile(patient: PatientRecord): PatientProfile {
  return { id: patient.id, name: patient.fullName, phone: patient.whatsappNumber || patient.phone, age: patient.age, gender: patient.gender, bloodGroup: "", tags: ["Regular"], lastVisit: "", allergies: patient.allergies, conditions: patient.medicalHistory, medications: patient.currentMedications, emergencyContact: "", totalVisits: 0, pendingPayment: false, internalNotes: "" };
}
