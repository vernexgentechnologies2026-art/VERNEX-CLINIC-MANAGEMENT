import { Button } from "../../../components/ui";
import type { WhatsAppConversation } from "../types";
import { ChatSimulator } from "./ChatSimulator";
import { WhatsAppBookingSummary } from "./WhatsAppBookingSummary";

export function ConversationPreview({ conversation }: { conversation: WhatsAppConversation }) {
  return <div className="space-y-4"><div><h3 className="font-bold">{conversation.patientName || conversation.phone}</h3><p className="text-sm text-slate-500">{conversation.phone} · {conversation.currentStep}</p></div><ChatSimulator compact messages={conversation.messages} />{conversation.bookingSummary && <WhatsAppBookingSummary summary={conversation.bookingSummary} />}<div className="flex flex-wrap gap-2"><Button>Transfer to Reception</Button><Button variant="secondary">Mark Closed</Button><Button variant="secondary">Create Appointment</Button><Button variant="secondary">Send Reminder</Button><Button variant="ghost">Retry Failed Message</Button></div></div>;
}
