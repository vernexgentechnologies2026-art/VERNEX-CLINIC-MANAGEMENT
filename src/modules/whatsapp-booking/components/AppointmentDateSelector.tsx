import { Card } from "../../../components/ui";
import { doctorAvailability } from "../mock";

export function AppointmentDateSelector({ doctorId }: { doctorId: string }) {
  const dates = doctorAvailability.find((item) => item.doctorId === doctorId)?.dates ?? doctorAvailability[0].dates;
  return <Card className="p-4"><p className="font-bold">Available dates</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{dates.map((date) => <span key={date.date} className="rounded-xl bg-slate-50 p-3 text-sm font-semibold">{date.label}<br /><small>{date.date}</small></span>)}</div></Card>;
}
