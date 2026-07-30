import { Card } from "../../../components/ui";
import type { DaySchedule } from "../types";
import { TimeSlotEditor } from "./TimeSlotEditor";

export function DayScheduleCard({ day }: { day: DaySchedule }) {
  return <Card className="p-4"><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold">{day.day}</h3><p className="text-xs text-slate-500">{day.enabled ? "Working day" : "Not available"}</p></div><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" defaultChecked={day.enabled} /> Enabled</label></div><TimeSlotEditor day={day} /><p className="mt-2 text-xs text-slate-500">Max {day.maxAppointmentsPerSlot} appointment per slot.</p></Card>;
}
