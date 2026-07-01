import { Button, Card } from "../../../components/ui";
import type { MedicineReminder } from "../types";
import { labelFromValue } from "../utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function MedicineReminderCard({ reminder }: { reminder: MedicineReminder }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{reminder.medicineName}</h3><p className="text-sm text-slate-500">{reminder.dosage} • {reminder.timing}</p><p className="mt-2 text-xs text-slate-500">{labelFromValue(reminder.foodTiming)} • {reminder.duration}</p><p className="text-xs text-slate-500">{reminder.startDate} to {reminder.endDate}</p></div><PatientStatusBadge status={reminder.status} /></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><Button>Mark as Taken</Button><Button variant="secondary">Snooze</Button><Button variant="ghost">View Prescription</Button></div></Card>;
}
