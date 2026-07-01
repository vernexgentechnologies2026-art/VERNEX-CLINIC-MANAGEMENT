import { useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button, Card, Input, PageHeader, Select } from "../../../components/ui";
import { getAppointments } from "../../../services/reception.service";
import { AppointmentFormModal } from "../components/AppointmentFormModal";
import { AppointmentTable } from "../components/AppointmentTable";
import { CancelAppointmentModal } from "../components/CancelAppointmentModal";
import { RescheduleAppointmentModal } from "../components/RescheduleAppointmentModal";
import { doctors } from "../mock";
import type { AppointmentSource, AppointmentStatus } from "../types";

export default function Appointments() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [source, setSource] = useState<AppointmentSource | "all">("all");
  const [modal, setModal] = useState<"add" | "reschedule" | "cancel" | null>(null);
  const rows = useMemo(() => getAppointments().filter((a) => (status === "all" || a.status === status) && (source === "all" || a.source === source) && `${a.patientName} ${a.phone} ${a.token}`.toLowerCase().includes(query.toLowerCase())), [query, status, source]);
  return <div className="space-y-5"><PageHeader title="Appointments" description="Search, filter, reschedule, cancel, mark arrived, and push patients into queue." action={<Button icon={<CalendarPlus className="size-4" />} onClick={() => setModal("add")}>Add Appointment</Button>} /><Card className="p-4"><div className="grid gap-3 lg:grid-cols-6"><Input className="lg:col-span-2" placeholder="Search appointment" value={query} onChange={(e) => setQuery(e.target.value)} /><Select><option>All doctors</option>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</Select><Select value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus | "all")}><option value="all">All status</option><option value="booked">Booked</option><option value="arrived">Arrived</option><option value="waiting">Waiting</option><option value="in_consultation">In consultation</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option></Select><Select value={source} onChange={(e) => setSource(e.target.value as AppointmentSource | "all")}><option value="all">All sources</option><option value="walk_in">Walk-in</option><option value="phone_call">Phone call</option><option value="qr_booking">QR booking</option><option value="whatsapp">WhatsApp</option><option value="website">Website</option></Select><Input type="date" defaultValue="2026-07-01" /></div><div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" className="min-h-8 px-3 py-1">List View</Button><Button variant="ghost" className="min-h-8 px-3 py-1">Day View</Button><Button variant="ghost" className="min-h-8 px-3 py-1" onClick={() => setModal("reschedule")}>Reschedule</Button><Button variant="ghost" className="min-h-8 px-3 py-1" onClick={() => setModal("cancel")}>Cancel</Button></div></Card><Card className="p-5"><AppointmentTable appointments={rows} /></Card><AppointmentFormModal open={modal === "add"} onClose={() => setModal(null)} /><RescheduleAppointmentModal open={modal === "reschedule"} onClose={() => setModal(null)} /><CancelAppointmentModal open={modal === "cancel"} onClose={() => setModal(null)} /></div>;
}
