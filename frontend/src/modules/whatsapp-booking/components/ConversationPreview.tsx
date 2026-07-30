import { useState } from "react";
import { Button } from "../../../components/ui";
import type { WhatsAppConversation } from "../types";
import { ChatSimulator } from "./ChatSimulator";
import { WhatsAppBookingSummary } from "./WhatsAppBookingSummary";

export function ConversationPreview({ conversation, onTransfer, onCloseConversation, onSendPlaceholder, loading = false }: { conversation: WhatsAppConversation; onTransfer?: () => void; onCloseConversation?: () => void; onSendPlaceholder?: (body: string) => void; loading?: boolean }) {
  const [body, setBody] = useState("Your WhatsApp message is queued as a placeholder. No external API call was made.");
  return <div className="space-y-4"><div><h3 className="font-bold">{conversation.patientName || conversation.phone}</h3><p className="text-sm text-slate-500">{conversation.phone} - {conversation.currentStep}</p></div><ChatSimulator compact messages={conversation.messages} />{conversation.bookingSummary && <WhatsAppBookingSummary summary={conversation.bookingSummary} />}<textarea className="min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={body} onChange={(event) => setBody(event.target.value)} /><div className="flex flex-wrap gap-2"><Button loading={loading} onClick={onTransfer}>Transfer to Reception</Button><Button loading={loading} variant="secondary" onClick={onCloseConversation}>Mark Closed</Button><Button variant="secondary">Create Appointment</Button><Button loading={loading} variant="secondary" onClick={() => onSendPlaceholder?.(body)}>Send Reminder</Button><Button variant="ghost" onClick={() => onSendPlaceholder?.(body)}>Retry Failed Message</Button></div></div>;
}
