import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui";
import { getClinicBookingProfile, getDoctors, getServices } from "../../../services/patientBooking.service";
import { ClinicHero } from "../components/ClinicHero";
import { DoctorSelector } from "../components/DoctorSelector";
import { QRBookingCard } from "../components/QRBookingCard";
import { ServiceSelector } from "../components/ServiceSelector";
import { WhatsAppBookingCTA } from "../components/WhatsAppBookingCTA";
import { useState } from "react";

export default function ClinicBookingPage() {
  const clinic = getClinicBookingProfile(); const [doctor, setDoctor] = useState("d1"); const [service, setService] = useState("s1");
  return <main className="min-h-screen bg-[#f7f9fa] px-4 py-5"><div className="mx-auto max-w-6xl space-y-5"><ClinicHero clinic={clinic} /><section className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="space-y-5"><div className="card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Choose Doctor</h2><Link to={`/book/${clinic.slug}/flow`}><Button>Book Appointment</Button></Link></div><DoctorSelector doctors={getDoctors()} selectedId={doctor} onSelect={setDoctor} /></div><div className="card p-5"><h2 className="mb-4 font-bold">Select Service</h2><ServiceSelector services={getServices()} selectedId={service} onSelect={setService} /></div><div className="card p-5"><h2 className="font-bold">Why patients use Vernex booking</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Digital prescription", "WhatsApp reminders", "Easy appointment booking", "Secure patient records"].map((x) => <div key={x} className="flex items-center gap-2 rounded-2xl bg-brand-50 p-3 text-sm font-bold text-brand-700"><CheckCircle2 className="size-4" />{x}</div>)}</div></div></div><aside className="space-y-5"><WhatsAppBookingCTA /><QRBookingCard clinic={clinic} /></aside></section></div></main>;
}
