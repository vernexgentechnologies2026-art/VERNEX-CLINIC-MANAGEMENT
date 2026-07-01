import { Button } from "../../../components/ui";
import type { WhatsAppMessage } from "../types";
import { ChatBubble } from "./ChatBubble";

export function ChatSimulator({ messages, compact = false }: { messages: WhatsAppMessage[]; compact?: boolean }) {
  return <div className="rounded-[1.75rem] border bg-[#e9f5ef] p-4"><div className="mb-3 flex items-center justify-between rounded-2xl bg-[#0b5964] px-4 py-3 text-white"><div><b>Vernex Clinic</b><p className="text-xs text-brand-100">WhatsApp booking demo</p></div><span className="text-xs font-bold">Demo</span></div><div className={`space-y-3 overflow-y-auto ${compact ? "max-h-72" : "max-h-[560px]"}`}>{messages.map((message) => <ChatBubble key={message.id} message={message} />)}</div><div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" className="min-h-8 px-3 py-1">Copy chat preview</Button><Button variant="secondary" className="min-h-8 px-3 py-1">Send to reception queue</Button></div></div>;
}
