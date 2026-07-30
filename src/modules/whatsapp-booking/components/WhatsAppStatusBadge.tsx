import type { WhatsAppConversationStatus, WhatsAppTemplateStatus } from "../types";
import { conversationStatusLabel, statusTone, templateStatusLabel } from "../utils";

export function WhatsAppStatusBadge({ status }: { status: WhatsAppConversationStatus | WhatsAppTemplateStatus | "demo" }) {
  if (status === "demo") return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">API Not Connected — Demo Mode</span>;
  const label = status in conversationStatusLabel ? conversationStatusLabel[status as WhatsAppConversationStatus] : templateStatusLabel[status as WhatsAppTemplateStatus];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(status)}`}>{label}</span>;
}
