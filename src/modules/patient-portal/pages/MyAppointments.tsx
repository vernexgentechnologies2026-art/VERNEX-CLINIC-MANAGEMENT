import { useMemo, useState } from "react";
import { Button } from "../../../components/ui";
import { getPatientAppointments } from "../../../services/patientPortal.service";
import { AppointmentHistoryCard } from "../components/AppointmentHistoryCard";
import { PatientEmptyState } from "../components/PatientEmptyState";

type Tab = "upcoming" | "past" | "cancelled";

export default function MyAppointments() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const appointments = getPatientAppointments();
  const rows = useMemo(() => appointments.filter((item) => tab === "upcoming" ? ["booked", "confirmed", "arrived"].includes(item.status) : tab === "past" ? item.status === "completed" : ["cancelled", "no_show"].includes(item.status)), [appointments, tab]);
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">My Appointments</h1><p className="text-sm text-slate-500">View upcoming, past, and cancelled visits.</p></div><div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-card">{(["upcoming", "past", "cancelled"] as Tab[]).map((item) => <Button key={item} variant={tab === item ? "primary" : "ghost"} onClick={() => setTab(item)}>{item.replace(/\b\w/g, (c) => c.toUpperCase())}</Button>)}</div>{rows.length === 0 ? <PatientEmptyState title="No appointments" description="Your appointments will appear here after booking." /> : <div className="space-y-3">{rows.map((appointment) => <AppointmentHistoryCard key={appointment.id} appointment={appointment} />)}</div>}</div>;
}
