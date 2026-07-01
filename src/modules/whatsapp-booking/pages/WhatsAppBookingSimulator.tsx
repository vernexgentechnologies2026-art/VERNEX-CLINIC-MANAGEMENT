import { Button, Card, PageHeader } from "../../../components/ui";
import { simulateWhatsAppBooking } from "../../../services/whatsappBooking.service";
import { ChatSimulator } from "../components/ChatSimulator";

export default function WhatsAppBookingSimulator() {
  const sim = simulateWhatsAppBooking();
  return <div className="space-y-5"><PageHeader title="WhatsApp Booking Simulator" description="Interactive-looking frontend simulation. No real messages are sent." action={<Button>Confirm mock booking</Button>} /><div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]"><Card className="p-5"><h2 className="font-bold">Simulation State</h2><div className="mt-4 space-y-3 text-sm">{Object.entries({ "Selected clinic": sim.selectedClinic, "Selected doctor": sim.selectedDoctor, "Selected service": sim.selectedService, "Selected slot": sim.selectedSlot, "Patient details": sim.patientDetails }).map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-400">{k}</p><b>{v}</b></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary">Restart simulation</Button><Button variant="secondary">Copy chat preview</Button><Button variant="secondary">Send to reception queue</Button></div></Card><ChatSimulator messages={sim.messages} /></div></div>;
}
