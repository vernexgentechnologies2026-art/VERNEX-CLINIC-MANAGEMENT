import { Card } from "../../../components/ui";

export function ReminderConsentCard({ consent = true }: { consent?: boolean }) {
  return <Card className="p-4"><p className="font-bold">Reminder consent</p><p className={`mt-2 text-sm font-semibold ${consent ? "text-emerald-700" : "text-amber-700"}`}>{consent ? "Patient consent confirmed" : "Consent not received"}</p></Card>;
}
