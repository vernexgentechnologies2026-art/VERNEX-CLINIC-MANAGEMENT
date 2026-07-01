import { Link } from "react-router-dom";
import { ArrowRight, CalendarPlus, UserPlus } from "lucide-react";
import { Button, Card, PageHeader } from "../../../components/ui";
import { clinic } from "../../../data/mockData";
import { getAppointments, getPendingBills, getQueueItems, getReceptionStats } from "../../../services/reception.service";
import { AppointmentTable } from "../components/AppointmentTable";
import { PatientSearchPanel } from "../components/PatientSearchPanel";
import { QuickActions } from "../components/QuickActions";
import { QueueTokenCard } from "../components/QueueTokenCard";
import { ReceptionStatsGrid } from "../components/ReceptionStatsGrid";
import { WhatsAppBookingPanel } from "../components/WhatsAppBookingPanel";
import { rupee } from "../utils";

export default function ReceptionDashboard() {
  const stats = getReceptionStats();
  const queue = getQueueItems().slice(0, 3);
  const appointments = getAppointments();
  const bills = getPendingBills();
  return <div className="space-y-5"><PageHeader title="Good morning, Reception" description={`${clinic.name} · Wednesday, 1 July 2026 · ${stats.activeDoctors} active doctors`} action={<div className="flex gap-2"><Button icon={<UserPlus className="size-4" />}>Add Walk-in</Button><Button variant="secondary" icon={<CalendarPlus className="size-4" />}>Create Appointment</Button></div>} /><PatientSearchPanel /><ReceptionStatsGrid stats={stats} /><QuickActions /><div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Live Queue Preview</h2><p className="text-xs text-slate-500">Fast token actions for front desk</p></div><Link className="text-sm font-bold text-brand-700" to="/reception/queue">Open Queue <ArrowRight className="inline size-4" /></Link></div><div className="grid gap-3 lg:grid-cols-3">{queue.map((item) => <QueueTokenCard key={item.id} item={item} />)}</div></Card><WhatsAppBookingPanel /></div><Card className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Upcoming Appointments</h2><Link className="text-sm font-bold text-brand-700" to="/reception/appointments">Manage all</Link></div><AppointmentTable appointments={appointments.slice(0, 4)} /></Card><Card className="p-5"><h2 className="font-bold">Pending Billing</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{bills.map((bill) => <div key={bill.id} className="rounded-xl border p-4"><p className="font-bold">{bill.patientName}</p><p className="text-sm text-slate-500">{bill.service} · {bill.doctorName}</p><div className="mt-3 flex items-center justify-between"><span className="font-['Manrope'] text-xl font-extrabold">{rupee(bill.amount - bill.discount)}</span><Button variant="secondary" className="min-h-8 px-3 py-1">Generate Bill</Button></div></div>)}</div></Card></div>;
}
