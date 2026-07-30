import { Button } from "../../../components/ui";
import type { WhatsAppConversation } from "../types";
import { WhatsAppEmptyState } from "./WhatsAppEmptyState";
import { WhatsAppStatusBadge } from "./WhatsAppStatusBadge";

export function ConversationList({ conversations, onView }: { conversations: WhatsAppConversation[]; onView: (conversation: WhatsAppConversation) => void }) {
  if (conversations.length === 0) {
    return <WhatsAppEmptyState title="No WhatsApp conversations found" description="Try changing the search, status, source, or date filters." />;
  }

  return <div className="grid gap-3">{conversations.map((conversation) => <div key={conversation.id} className="rounded-2xl border bg-white p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h3 className="font-bold">{conversation.patientName || conversation.phone}</h3><p className="text-sm text-slate-500">{conversation.lastMessage}</p><p className="mt-1 text-xs text-slate-400">{conversation.currentStep} · {conversation.lastUpdated} · {conversation.source}</p></div><div className="flex flex-wrap items-center gap-2"><WhatsAppStatusBadge status={conversation.status} />{conversation.appointmentToken && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">{conversation.appointmentToken}</span>}<Button className="min-h-8 px-3 py-1" onClick={() => onView(conversation)}>View</Button></div></div></div>)}</div>;
}
