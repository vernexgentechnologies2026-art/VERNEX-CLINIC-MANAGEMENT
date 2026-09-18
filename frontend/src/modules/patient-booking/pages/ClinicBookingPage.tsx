import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button, LoadingSkeleton } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import { ClinicHero } from "../components/ClinicHero";
import { DoctorSelector } from "../components/DoctorSelector";
import { QRBookingCard } from "../components/QRBookingCard";
import { ServiceSelector } from "../components/ServiceSelector";
import { WhatsAppBookingCTA } from "../components/WhatsAppBookingCTA";
import { BookingEmptyState } from "../components/BookingEmptyState";
import type { BookingDoctor, BookingService, ClinicBookingProfile } from "../types";

export default function ClinicBookingPage() {
  const { clinicSlug = "" } = useParams();
  const [clinic, setClinic] = useState<ClinicBookingProfile | null>(null);
  const [doctors, setDoctors] = useState<BookingDoctor[]>([]);
  const [clinicServices, setClinicServices] = useState<BookingService[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [profile, nextDoctors, nextServices] = await Promise.all([
          services.booking.getClinicProfile(clinicSlug),
          services.booking.getDoctors(clinicSlug),
          services.booking.getServices(clinicSlug),
        ]);
        if (!mounted) return;
        setClinic(profile);
        setDoctors(nextDoctors);
        setClinicServices(nextServices);
        setDoctorId(nextDoctors[0]?.id ?? "");
        setServiceId(nextServices[0]?.id ?? "");
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "This booking page is not available.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [clinicSlug]);

  if (loading) return <main className="min-h-screen bg-[#f7f9fa] p-5"><div className="mx-auto max-w-6xl"><LoadingSkeleton rows={5} /></div></main>;
  if (error || !clinic) return <main className="grid min-h-screen place-items-center bg-[#f7f9fa] p-5"><BookingEmptyState title="Booking page unavailable" description={error || "This clinic is not accepting online bookings right now."} /></main>;

  const bookingHref = doctorId ? `/book/${clinic.slug}/flow?doctorId=${doctorId}${serviceId ? `&serviceId=${serviceId}` : ""}` : `/book/${clinic.slug}/flow`;

  return <main className="min-h-screen bg-[#f7f9fa] px-4 py-5"><div className="mx-auto max-w-6xl space-y-5">
    <ClinicHero clinic={clinic} doctors={doctors} />
    <section className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
      <div className="space-y-5">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Choose Doctor</h2>
            <Link to={bookingHref}><Button disabled={doctors.length === 0}>Book Appointment</Button></Link>
          </div>
          {doctors.length > 0
            ? <DoctorSelector doctors={doctors} selectedId={doctorId} onSelect={setDoctorId} />
            : <BookingEmptyState title="No doctors available" description="This clinic has not published any doctors for online booking yet." />}
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Select Service</h2>
          {clinicServices.length > 0
            ? <ServiceSelector services={clinicServices} selectedId={serviceId} onSelect={setServiceId} />
            : <BookingEmptyState title="No services listed" description="Consultation services will appear here once the clinic adds them." />}
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Why patients use Vernex booking</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{["Digital prescription", "WhatsApp reminders", "Easy appointment booking", "Secure patient records"].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl bg-brand-50 p-3 text-sm font-bold text-brand-700"><CheckCircle2 className="size-4" />{item}</div>)}</div>
        </div>
      </div>
      <aside className="space-y-5"><WhatsAppBookingCTA clinic={clinic} /><QRBookingCard clinic={clinic} /></aside>
    </section>
  </div></main>;
}
