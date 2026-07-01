import { Phone, MessageCircle, CalendarPlus } from "lucide-react";
import { BrandLogo, Button } from "../../../components/ui";

export function PatientPortalHeader({ name }: { name: string }) {
  return <div className="rounded-2xl bg-white p-4 shadow-card sm:p-5"><div className="flex items-center gap-3"><BrandLogo className="size-12" /><div><p className="text-sm text-slate-500">Vernex Clinic OS</p><h1 className="text-2xl font-bold text-slate-950">Hi, {name.split(" ")[0]}</h1></div></div><p className="mt-3 text-sm text-slate-500">Your appointments, medicines, prescriptions, bills and follow-ups in one simple place.</p><div className="mt-4 grid gap-2 sm:grid-cols-3"><Button variant="secondary" icon={<Phone className="size-4" />}>Call Clinic</Button><Button variant="secondary" icon={<MessageCircle className="size-4" />}>WhatsApp</Button><Button icon={<CalendarPlus className="size-4" />}>Book Follow-up</Button></div></div>;
}
