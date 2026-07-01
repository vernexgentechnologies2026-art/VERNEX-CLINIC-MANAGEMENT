import { useMemo, useState } from "react";
import { Button } from "../../../components/ui";
import { getPatientFollowUps } from "../../../services/patientPortal.service";
import { FollowUpCard } from "../components/FollowUpCard";
import { PatientEmptyState } from "../components/PatientEmptyState";
import type { PatientFollowUpStatus } from "../types";

export default function MyFollowUps() {
  const [tab, setTab] = useState<PatientFollowUpStatus>("due_today");
  const followUps = getPatientFollowUps();
  const rows = useMemo(() => followUps.filter((item) => item.status === tab), [followUps, tab]);
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">My Follow-ups</h1><p className="text-sm text-slate-500">Track follow-up visits and reminders.</p></div><div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-card sm:grid-cols-4">{(["due_today", "upcoming", "overdue", "completed"] as PatientFollowUpStatus[]).map((item) => <Button key={item} variant={tab === item ? "primary" : "ghost"} onClick={() => setTab(item)}>{item.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Button>)}</div>{rows.length === 0 ? <PatientEmptyState title="No follow-ups" description="Follow-up reminders will appear here when your doctor suggests one." /> : <div className="space-y-3">{rows.map((followUp) => <FollowUpCard key={followUp.id} followUp={followUp} />)}</div>}</div>;
}
