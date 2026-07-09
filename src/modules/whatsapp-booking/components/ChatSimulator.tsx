import { Button } from "../../../components/ui";
import type { WhatsAppMessage } from "../types";
import { ChatBubble } from "./ChatBubble";

export function ChatSimulator({ messages, compact = false }: { messages: WhatsAppMessage[]; compact?: boolean }) {
  return <section className="overflow-hidden rounded-card border bg-brand-50"><div className="flex items-center justify-between bg-brand-900 px-4 py-3 text-white"><div><b>Vernex Clinic</b><p className="text-xs text-brand-100">WhatsApp booking demo</p></div><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">Demo</span></div><div className={`space-y-3 overflow-y-auto p-4 ${compact ? "max-h-72" : "max-h-[min(620px,70vh)]"}`}>{messages.map((message) => <ChatBubble key={message.id} message={message} />)}</div><div className="sticky bottom-0 flex flex-wrap gap-2 border-t bg-white/90 p-3 backdrop-blur"><Button variant="secondary" size="sm">Talk to Reception</Button><Button variant="secondary" size="sm">Copy preview</Button><Button size="sm">Send to queue</Button></div></section>;
}
