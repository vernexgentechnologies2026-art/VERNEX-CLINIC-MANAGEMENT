import { Stethoscope } from "lucide-react";
import { Button, PageHeader } from "../../../components/ui";
import { getDoctorQueue, getDoctorStats } from "../../../services/doctor.service";
import { DoctorEmptyState } from "../components/DoctorEmptyState";
import { DoctorQueueTable } from "../components/DoctorQueueTable";
import { DoctorStatsGrid } from "../components/DoctorStatsGrid";

const doctorName = "Dr. Priya Sharma";
const clinicName = "Vernex Multispeciality Clinic";

export default function DoctorQueue() {
  const queue = getDoctorQueue();
  const whatsappAppointment = queue.find((item) => item.source.toLowerCase() === "whatsapp");
  return <div className="space-y-5"><PageHeader title="Good morning, Doctor" description={`${doctorName} - ${clinicName} - Wednesday, 1 July 2026 - Active consultation in progress`} action={<Button icon={<Stethoscope className="size-4" />}>Resume Consultation</Button>} />{whatsappAppointment && <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4"><p className="text-xs font-bold uppercase text-brand-700">New WhatsApp Appointment</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-brand-950">{whatsappAppointment.patientName}</h2><p className="text-sm text-brand-800">{whatsappAppointment.department?.replace("_", " ")} - {whatsappAppointment.appointmentTime} - {whatsappAppointment.mainProblem}</p></div><Button variant="secondary">View appointment</Button></div></div>}<DoctorStatsGrid stats={getDoctorStats()} />{queue.length ? <DoctorQueueTable items={queue} /> : <DoctorEmptyState />}</div>;
}
