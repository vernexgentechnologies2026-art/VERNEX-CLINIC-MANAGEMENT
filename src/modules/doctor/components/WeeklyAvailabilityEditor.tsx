import type { DoctorAvailability } from "../types";
import { DayScheduleCard } from "./DayScheduleCard";

export function WeeklyAvailabilityEditor({ availability }: { availability: DoctorAvailability }) {
  return <div className="grid gap-3 lg:grid-cols-2">{availability.weekly.map((day) => <DayScheduleCard key={day.day} day={day} />)}</div>;
}
