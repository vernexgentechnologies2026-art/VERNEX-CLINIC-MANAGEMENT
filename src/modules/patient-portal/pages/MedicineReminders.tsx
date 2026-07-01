import { getMedicineReminders } from "../../../services/patientPortal.service";
import { MedicineReminderCard } from "../components/MedicineReminderCard";
import { PatientEmptyState } from "../components/PatientEmptyState";
import type { MedicineReminder } from "../types";

const sections: MedicineReminder["timeOfDay"][] = ["morning", "afternoon", "evening", "night"];

export default function MedicineReminders() {
  const reminders = getMedicineReminders();
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">Medicine Reminders</h1><p className="text-sm text-slate-500">A simple reminder list for today's medicines.</p></div>{reminders.length === 0 ? <PatientEmptyState title="No medicine reminders" description="Medicine reminders will appear when a prescription is active." /> : sections.map((section) => { const rows = reminders.filter((item) => item.timeOfDay === section); return <section key={section} className="space-y-3"><h2 className="font-bold capitalize">{section}</h2>{rows.length === 0 ? <div className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-card">No {section} medicines.</div> : rows.map((reminder) => <MedicineReminderCard key={reminder.id} reminder={reminder} />)}</section>; })}</div>;
}
