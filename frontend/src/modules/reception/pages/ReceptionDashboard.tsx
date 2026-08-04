import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarPlus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, PageHeader } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { AppointmentRecord, PatientRecord } from "../../../shared/types/domain";
import type { Tables } from "../../../shared/types/database.types";
import { AppointmentTable } from "../components/AppointmentTable";
import { PatientSearchPanel } from "../components/PatientSearchPanel";
import { QuickActions } from "../components/QuickActions";
import { QueueTokenCard } from "../components/QueueTokenCard";
import { ReceptionStatsGrid } from "../components/ReceptionStatsGrid";
import { WhatsAppBookingPanel } from "../components/WhatsAppBookingPanel";
import type { Appointment, AppointmentSource, BillingShortcut, QueueItem, ReceptionStats } from "../types";
import { loadPendingBills } from "../pendingBills";
import { rupee } from "../utils";

type DoctorOption = Tables<"doctor_profiles"> & { label: string };

const today = new Date().toISOString().slice(0, 10);
const toSource = (source: string): AppointmentSource => source === "phone" ? "phone_call" : source === "qr" ? "qr_booking" : source === "whatsapp" || source === "website" || source === "walk_in" ? source : "walk_in";

export default function ReceptionDashboard() {
  const [clinicName, setClinicName] = useState("Vernex Clinic");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [bills, setBills] = useState<BillingShortcut[]>([]);

  const loadDashboard = async () => {
    try {
      const [context, appointmentRows, queueRows, doctorRows, pendingBills] = await Promise.all([services.auth.getCurrentAuthContext(), services.appointments.getTodayAppointments(), services.appointments.getQueue(), services.doctor.getDoctorProfiles(), loadPendingBills()]);
      const doctors = await loadDoctorLabels(doctorRows);
      const patientIds = Array.from(new Set([...appointmentRows, ...queueRows].map((item) => item.patientId)));
      const patientEntries = await Promise.all(patientIds.map(async (id): Promise<[string, PatientRecord | null]> => {
        try {
          return [id, await services.patients.getPatientById(id)];
        } catch {
          return [id, null];
        }
      }));
      const patientMap = new Map(patientEntries);
      setClinicName((context.clinic as { name?: string } | null)?.name ?? "Vernex Clinic");
      setBills(pendingBills);
      setAppointments(appointmentRows.map((appointment) => mapAppointment(appointment, patientMap.get(appointment.patientId), doctors.find((doctor) => doctor.id === appointment.doctorId))));
      setQueue(queueRows.slice(0, 3).map((appointment) => mapQueueItem(appointment, patientMap.get(appointment.patientId), doctors.find((doctor) => doctor.id === appointment.doctorId))));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load reception dashboard.");
    }
  };

  useEffect(() => { void loadDashboard(); }, []);

  const stats: ReceptionStats = useMemo(() => ({
    todayAppointments: appointments.filter((item) => item.date === today).length,
    waitingPatients: queue.filter((item) => item.status === "waiting" || item.status === "arrived").length,
    inConsultation: queue.filter((item) => item.status === "in_consultation").length,
    completed: appointments.filter((item) => item.status === "completed").length,
    cancelledNoShow: appointments.filter((item) => item.status === "cancelled" || item.status === "no_show").length,
    pendingBills: bills.length,
    activeDoctors: new Set(appointments.map((item) => item.doctorId).filter(Boolean)).size,
  }), [appointments, bills, queue]);

  return <div className="space-y-5"><PageHeader title="Good morning, Reception" description={`${clinicName} - ${stats.activeDoctors} active doctors`} action={<div className="flex gap-2"><Link to="/reception/new-patient"><Button icon={<UserPlus className="size-4" />}>Add Walk-in</Button></Link><Link to="/reception/appointments"><Button variant="secondary" icon={<CalendarPlus className="size-4" />}>Create Appointment</Button></Link></div>} /><PatientSearchPanel /><ReceptionStatsGrid stats={stats} /><QuickActions /><div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Live Queue Preview</h2><p className="text-xs text-slate-500">Fast token actions for front desk</p></div><Link className="text-sm font-bold text-brand-700" to="/reception/queue">Open Queue <ArrowRight className="inline size-4" /></Link></div><div className="grid gap-3 lg:grid-cols-3">{queue.map((item) => <QueueTokenCard key={item.id} item={item} />)}</div></Card><WhatsAppBookingPanel /></div><Card className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Upcoming Appointments</h2><Link className="text-sm font-bold text-brand-700" to="/reception/appointments">Manage all</Link></div><AppointmentTable appointments={appointments.slice(0, 4)} /></Card><Card className="p-5"><h2 className="font-bold">Pending Billing</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{bills.length > 0 ? bills.slice(0, 6).map((bill) => <div key={bill.id} className="rounded-xl border p-4"><p className="font-bold">{bill.patientName}</p><p className="text-sm text-slate-500">{bill.service}{bill.doctorName ? ` - ${bill.doctorName}` : ""}</p><div className="mt-3 flex items-center justify-between"><span className="font-['Manrope'] text-xl font-extrabold">{rupee(bill.amount - bill.discount)}</span><Link to="/reception/billing"><Button variant="secondary" className="min-h-8 px-3 py-1">Collect</Button></Link></div></div>) : <p className="text-sm text-slate-500">Every invoice is fully settled.</p>}</div></Card></div>;
}

async function loadDoctorLabels(rows: Tables<"doctor_profiles">[]): Promise<DoctorOption[]> {
  return Promise.all(rows.map(async (doctor) => {
    try {
      const staff = await services.users.getStaffUserById(doctor.staff_id);
      return { ...doctor, label: staff.fullName };
    } catch {
      return { ...doctor, label: doctor.specialization || doctor.department || "Doctor" };
    }
  }));
}

function mapAppointment(appointment: AppointmentRecord, patient?: PatientRecord | null, doctor?: DoctorOption): Appointment {
  return { id: appointment.id, token: appointment.tokenNumber || "Pending", patientId: appointment.patientId, patientName: patient?.fullName ?? "Unknown patient", phone: patient?.phone ?? "", age: patient?.age ?? 0, gender: patient?.gender ?? "other", doctorId: appointment.doctorId, doctorName: doctor?.label ?? "Unassigned", service: appointment.department || "General", date: appointment.date, time: appointment.time, source: toSource(appointment.source), status: appointment.status, paymentStatus: "pending", notes: appointment.reason };
}

function mapQueueItem(appointment: AppointmentRecord, patient?: PatientRecord | null, doctor?: DoctorOption): QueueItem {
  return { id: appointment.id, token: appointment.tokenNumber || "Pending", patientName: patient?.fullName ?? "Unknown patient", age: patient?.age ?? 0, gender: patient?.gender ?? "other", doctorName: doctor?.label ?? "Unassigned", service: appointment.department || "General", status: appointment.status, arrivalTime: appointment.time || appointment.date, waitingMinutes: 0, reason: appointment.reason || "Appointment" };
}
