import { Button, Card } from "../../../components/ui";
import type { PatientFollowUp } from "../types";
import { labelFromValue } from "../utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function FollowUpCard({ followUp }: { followUp: PatientFollowUp }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{followUp.doctorName}</h3><p className="text-sm text-slate-500">{followUp.reason}</p><p className="mt-2 text-sm font-semibold">{followUp.followUpDate}</p><p className="text-xs text-slate-500">Previous: {followUp.previousDiagnosis} • Reminder {labelFromValue(followUp.reminderStatus)}</p></div><PatientStatusBadge status={followUp.status} /></div><div className="mt-4 grid gap-2 sm:grid-cols-4"><Button>Book Follow-up</Button><Button variant="secondary">Send WhatsApp Reminder</Button><Button variant="secondary">Mark as Planned</Button><Button variant="ghost">Contact Clinic</Button></div></Card>;
}
