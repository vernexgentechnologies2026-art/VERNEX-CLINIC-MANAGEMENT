import { useState } from "react";
import { Button, Card, PageHeader } from "../../../components/ui";
import { getDoctorAvailability } from "../../../services/doctor.service";
import { AvailabilityPreview } from "../components/AvailabilityPreview";
import { BlockedDateModal } from "../components/BlockedDateModal";
import { WeeklyAvailabilityEditor } from "../components/WeeklyAvailabilityEditor";

export default function Availability() {
  const [open, setOpen] = useState(false);
  const availability = getDoctorAvailability();
  return <div className="space-y-5"><PageHeader title="Doctor Availability" description="Configure mock working hours used by WhatsApp slot suggestions." action={<Button onClick={() => setOpen(true)}>Block date</Button>} /><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><WeeklyAvailabilityEditor availability={availability} /><div className="space-y-5"><AvailabilityPreview availability={availability} /><Card className="p-5"><h2 className="font-bold">Blocked dates</h2><div className="mt-3 space-y-2">{availability.blockedDates.map((blocked) => <p key={blocked.date} className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{blocked.date} - {blocked.reason}</p>)}</div></Card></div></div><BlockedDateModal open={open} onClose={() => setOpen(false)} /></div>;
}
