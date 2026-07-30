import { useMemo, useState } from "react";
import { Card, Input, Modal, PageHeader, Select } from "../../../components/ui";
import { getWhatsAppConversations } from "../../../services/whatsappBooking.service";
import { ConversationList } from "../components/ConversationList";
import { ConversationPreview } from "../components/ConversationPreview";
import type { WhatsAppConversation, WhatsAppConversationStatus } from "../types";

export default function WhatsAppConversations() {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState<WhatsAppConversationStatus | "all">("all"); const [selected, setSelected] = useState<WhatsAppConversation | null>(null);
  const rows = useMemo(() => getWhatsAppConversations().filter((conversation) => (status === "all" || conversation.status === status) && `${conversation.patientName ?? ""} ${conversation.phone} ${conversation.lastMessage}`.toLowerCase().includes(query.toLowerCase())), [query, status]);
  return <div className="space-y-5"><PageHeader title="WhatsApp Conversations" description="Track patient chats, booking steps, handoffs and failed-message placeholders." /><Card className="p-4"><div className="grid gap-3 lg:grid-cols-4"><Input placeholder="Search patient name/phone" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onChange={(e) => setStatus(e.target.value as WhatsAppConversationStatus | "all")}><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="appointment_confirmed">Appointment confirmed</option><option value="waiting_for_patient">Waiting for patient</option><option value="transferred_to_reception">Transferred</option><option value="closed">Closed</option><option value="failed">Failed</option></Select><Select><option>All sources</option><option>WhatsApp</option><option>QR</option><option>Website</option></Select><Input type="date" defaultValue="2026-07-01" /></div></Card><ConversationList conversations={rows} onView={setSelected} /><Modal open={!!selected} onClose={() => setSelected(null)} title="Conversation Preview">{selected && <ConversationPreview conversation={selected} />}</Modal></div>;
}
