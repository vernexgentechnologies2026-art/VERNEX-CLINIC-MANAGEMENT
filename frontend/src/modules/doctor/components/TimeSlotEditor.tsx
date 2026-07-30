import { Input, Select } from "../../../components/ui";
import type { DaySchedule } from "../types";

export function TimeSlotEditor({ day }: { day: DaySchedule }) {
  return <div className="grid gap-2 sm:grid-cols-5"><Input defaultValue={day.startTime} /><Input defaultValue={day.endTime} /><Input defaultValue={day.breakTime} /><Select defaultValue={day.slotDurationMinutes}><option value={10}>10 min</option><option value={15}>15 min</option><option value={30}>30 min</option></Select><Input type="number" defaultValue={day.maxAppointmentsPerDay} /></div>;
}
