import { Stethoscope } from "lucide-react";
import { Button, PageHeader } from "../../../components/ui";
import { clinic } from "../../../data/mockData";
import { getDoctorQueue, getDoctorStats } from "../../../services/doctor.service";
import { doctorName } from "../mock";
import { DoctorStatsGrid } from "../components/DoctorStatsGrid";
import { DoctorQueueTable } from "../components/DoctorQueueTable";
import { DoctorEmptyState } from "../components/DoctorEmptyState";

export default function DoctorQueue() {
  const queue = getDoctorQueue();
  return <div className="space-y-5"><PageHeader title="Good morning, Doctor" description={`${doctorName} · ${clinic.name} · Wednesday, 1 July 2026 · Active consultation in progress`} action={<Button icon={<Stethoscope className="size-4" />}>Resume Consultation</Button>} /><DoctorStatsGrid stats={getDoctorStats()} />{queue.length ? <DoctorQueueTable items={queue} /> : <DoctorEmptyState />}</div>;
}
