import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "../../../components/ui";
import { getWhatsAppBookingStats, getWhatsAppConversations, getWhatsAppFlowSteps, getWhatsAppTemplates } from "../../../services/whatsappBooking.service";
import { BookingFlowTimeline } from "../components/BookingFlowTimeline";
import { ChatSimulator } from "../components/ChatSimulator";
import { ConversationList } from "../components/ConversationList";
import { TemplateMessageCard } from "../components/TemplateMessageCard";
import { WhatsAppStatsGrid } from "../components/WhatsAppStatsGrid";
import { WhatsAppStatusBadge } from "../components/WhatsAppStatusBadge";
import { simulation } from "../mock";

export default function WhatsAppBookingDashboard() {
  const conversations = getWhatsAppConversations().slice(0, 3);
  return <div className="space-y-5"><PageHeader title="WhatsApp Booking" description="Patients can book appointments by sending ‘Hi’ to the clinic WhatsApp number." action={<div className="flex flex-wrap gap-2"><WhatsAppStatusBadge status="demo" /><Link to="/whatsapp-booking/simulator"><Button>Open Simulator</Button></Link></div>} /><Card className="p-4"><p className="text-sm font-semibold text-slate-600">Clinic WhatsApp number placeholder: <span className="text-brand-700">+91 98765 43210</span></p></Card><WhatsAppStatsGrid stats={getWhatsAppBookingStats()} /><Card className="p-5"><h2 className="mb-4 font-bold">How It Works</h2><BookingFlowTimeline steps={getWhatsAppFlowSteps()} /></Card><div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><Card className="p-5"><div className="mb-4 flex justify-between"><h2 className="font-bold">Recent WhatsApp Conversations</h2><Link className="text-sm font-bold text-brand-700" to="/whatsapp-booking/conversations">View all</Link></div><ConversationList conversations={conversations} onView={() => undefined} /></Card><Card className="p-5"><h2 className="mb-4 font-bold">Booking Flow Preview</h2><ChatSimulator compact messages={simulation.messages.slice(0, 3)} /></Card></div><Card className="p-5"><h2 className="mb-4 font-bold">Template Status</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{getWhatsAppTemplates().slice(0, 6).map((template) => <TemplateMessageCard key={template.id} template={template} onEdit={() => undefined} />)}</div></Card></div>;
}
