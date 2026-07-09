import { useState } from "react";
import { Button, Card, PageHeader } from "../../../components/ui";
import { simulateWhatsAppBooking } from "../../../services/whatsappBooking.service";
import { AppointmentDateSelector } from "../components/AppointmentDateSelector";
import { AppointmentSlotSelector } from "../components/AppointmentSlotSelector";
import { BookingConfirmationCard } from "../components/BookingConfirmationCard";
import { BookingToDashboardPreview } from "../components/BookingToDashboardPreview";
import { ChatSimulator } from "../components/ChatSimulator";
import { ClinicTypeSelector } from "../components/ClinicTypeSelector";
import { DepartmentSelector } from "../components/DepartmentSelector";
import { DoctorAvailabilitySelector } from "../components/DoctorAvailabilitySelector";
import { DoctorNotificationPreview } from "../components/DoctorNotificationPreview";
import { MedicineReminderPreview } from "../components/MedicineReminderPreview";
import { PatientDetailsCollector } from "../components/PatientDetailsCollector";
import { PrescriptionDeliveryPreview } from "../components/PrescriptionDeliveryPreview";
import { ProblemCollector } from "../components/ProblemCollector";
import { ReminderConsentCard } from "../components/ReminderConsentCard";
import type { ClinicMode } from "../types";

export default function WhatsAppBookingSimulator() {
  const [mode, setMode] = useState<ClinicMode>("multi_speciality");
  const sim = simulateWhatsAppBooking(mode);
  return <div className="space-y-5"><PageHeader title="WhatsApp Booking Simulator" description="Frontend simulation for WhatsApp-first booking. No real messages are sent." action={<Button>Confirm mock booking</Button>} /><div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]"><div className="space-y-5"><ClinicTypeSelector value={mode} onChange={setMode} /><Card className="p-5"><h2 className="font-bold">Simulation State</h2><div className="mt-4 space-y-3 text-sm">{Object.entries({ "Selected clinic": sim.selectedClinic, "Selected department": sim.selectedDepartment?.replace("_", " ") ?? "Not needed", "Selected doctor": sim.selectedDoctor, "Selected service": sim.selectedService, "Selected slot": sim.selectedSlot, "Patient details": sim.patientDetails }).map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-400">{k}</p><b className="capitalize">{v}</b></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary">Restart simulation</Button><Button variant="secondary">Talk to Reception</Button><Button variant="secondary">Send to doctor queue</Button></div></Card><DepartmentSelector selected={sim.selectedDepartment} /><DoctorAvailabilitySelector department={sim.selectedDepartment} /><AppointmentDateSelector doctorId={sim.confirmedAppointment.doctorId} /><AppointmentSlotSelector doctorId={sim.confirmedAppointment.doctorId} /></div><div className="space-y-5"><ChatSimulator messages={sim.messages} /><div className="grid gap-5 lg:grid-cols-2"><PatientDetailsCollector details={sim.patientDetails} /><ProblemCollector problem={sim.confirmedAppointment.mainProblem} /><BookingConfirmationCard appointment={sim.confirmedAppointment} /><DoctorNotificationPreview appointment={sim.confirmedAppointment} /><BookingToDashboardPreview appointment={sim.confirmedAppointment} /><ReminderConsentCard /><PrescriptionDeliveryPreview /><MedicineReminderPreview /></div></div></div></div>;
}
