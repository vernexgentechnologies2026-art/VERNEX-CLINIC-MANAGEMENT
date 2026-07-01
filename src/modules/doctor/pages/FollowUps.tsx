import { useMemo, useState } from "react";
import { Input, PageHeader, Select, Button } from "../../../components/ui";
import { getFollowUps } from "../../../services/doctor.service";
import type { FollowUpStatus } from "../types";
import { FollowUpStatusBadge } from "../components/StatusBadge";

export default function FollowUps() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FollowUpStatus | "all">("all");
  const rows = useMemo(() => getFollowUps().filter((f) => (status === "all" || f.status === status) && `${f.patientName} ${f.phone} ${f.lastDiagnosis}`.toLowerCase().includes(query.toLowerCase())), [query, status]);
  return <div className="space-y-5"><PageHeader title="Follow-ups" description="Follow-up due today, upcoming, overdue, and completed reminders." /><div className="card p-4"><div className="grid gap-3 md:grid-cols-[1fr_220px]"><Input placeholder="Search patient" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onChange={(e) => setStatus(e.target.value as FollowUpStatus | "all")}><option value="all">All follow-ups</option><option value="due_today">Today</option><option value="upcoming">Upcoming</option><option value="overdue">Overdue</option><option value="completed">Completed</option></Select></div></div><div className="grid gap-3 lg:grid-cols-2">{rows.map((f) => <div key={f.id} className="card p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{f.patientName}</h3><p className="text-sm text-slate-500">{f.phone} · {f.lastDiagnosis}</p></div><FollowUpStatusBadge status={f.status} /></div><p className="mt-3 text-sm"><b>{f.followUpDate}</b> · {f.reason}</p><p className="mt-1 text-xs text-slate-500">{f.reminderStatus}</p><div className="mt-4 flex flex-wrap gap-2"><Button>Start Follow-up Consultation</Button><Button variant="secondary">Mark Completed</Button><Button variant="secondary">Send WhatsApp Reminder</Button><Button variant="ghost">Reschedule</Button></div></div>)}</div></div>;
}
