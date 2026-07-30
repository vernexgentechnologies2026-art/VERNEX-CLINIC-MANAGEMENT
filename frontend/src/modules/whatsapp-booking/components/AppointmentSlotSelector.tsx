import { Card } from "../../../components/ui";
import { doctorAvailability } from "../mock";

export function AppointmentSlotSelector({ doctorId }: { doctorId: string }) {
  const slots = doctorAvailability.find((item) => item.doctorId === doctorId)?.dates[0].slots ?? [];
  return <Card className="p-4"><p className="font-bold">Time slots</p><div className="mt-3 flex flex-wrap gap-2">{slots.map((slot) => <span key={slot} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{slot}</span>)}</div></Card>;
}
