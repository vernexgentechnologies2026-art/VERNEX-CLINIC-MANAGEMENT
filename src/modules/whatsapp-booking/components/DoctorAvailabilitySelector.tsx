import { Card } from "../../../components/ui";
import { whatsappDoctors } from "../mock";
import type { ClinicDepartment } from "../types";

export function DoctorAvailabilitySelector({ department }: { department?: ClinicDepartment }) {
  const doctors = department ? whatsappDoctors.filter((doctor) => doctor.department === department) : whatsappDoctors;
  return <Card className="p-4"><p className="font-bold">Available doctors</p><div className="mt-3 space-y-2">{doctors.map((doctor) => <div key={doctor.id} className="rounded-xl border p-3 text-sm"><b>{doctor.name}</b><p className="text-slate-500">{doctor.qualification} - {doctor.specialisation}</p><p className="mt-1 text-xs font-bold text-brand-700">Rs {doctor.consultationFee} - {doctor.nextAvailableSlot}</p></div>)}</div></Card>;
}
