import type { DoctorQueueStatus, FollowUpStatus, PatientTag } from "../types";
import { followUpStatusLabel, queueStatusLabel, tagTone } from "../utils";

export function QueueStatusBadge({ status }: { status: DoctorQueueStatus }) {
  const tone = status === "waiting" ? "bg-amber-50 text-amber-700" : status === "in_consultation" ? "bg-violet-50 text-violet-700" : status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{queueStatusLabel[status]}</span>;
}
export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  const tone = status === "overdue" ? "bg-rose-50 text-rose-700" : status === "due_today" ? "bg-amber-50 text-amber-700" : status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{followUpStatusLabel[status]}</span>;
}
export function PatientTagBadge({ tag }: { tag: PatientTag }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tagTone(tag)}`}>{tag}</span>;
}
