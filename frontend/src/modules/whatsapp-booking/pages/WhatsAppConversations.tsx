import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Card, Input, Modal, PageHeader, Select } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import { ConversationList } from "../components/ConversationList";
import { ConversationPreview } from "../components/ConversationPreview";
import type { WhatsAppConversation, WhatsAppConversationStatus } from "../types";

export default function WhatsAppConversations() {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState<WhatsAppConversationStatus | "all">("all"); const [selected, setSelected] = useState<WhatsAppConversation | null>(null); const [conversations, setConversations] = useState<WhatsAppConversation[]>([]); const [phone, setPhone] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const load = () => { setLoading(true); services.whatsapp.getConversations().then((rows) => { setConversations(rows); if (selected) setSelected(rows.find((row) => row.id === selected.id) ?? selected); }).catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load WhatsApp conversations.")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const rows = useMemo(() => conversations.filter((conversation) => (status === "all" || conversation.status === status) && `${conversation.patientName ?? ""} ${conversation.phone} ${conversation.lastMessage}`.toLowerCase().includes(query.toLowerCase())), [query, status, conversations]);
  const createConversation = async () => {
    if (!phone.trim()) return toast.error("Enter a WhatsApp phone number.");
    setSaving(true);
    try {
      const conversation = await services.whatsapp.createConversation({ phone: phone.trim(), lastMessage: "Conversation created.", currentStep: "New conversation" });
      toast.success("WhatsApp conversation saved.");
      setPhone("");
      setSelected(conversation);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create WhatsApp conversation.");
    } finally {
      setSaving(false);
    }
  };
  const transfer = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const next = await services.whatsapp.transferConversationToReception(selected.id);
      setSelected(next);
      toast.success("Conversation transferred.");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to transfer conversation.");
    } finally {
      setSaving(false);
    }
  };
  const closeConversation = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const next = await services.whatsapp.updateConversation(selected.id, { status: "closed", currentStep: "Closed", lastMessage: "Conversation closed." });
      setSelected(next);
      toast.success("Conversation closed.");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to close conversation.");
    } finally {
      setSaving(false);
    }
  };
  const sendPlaceholder = async (body: string) => {
    if (!selected) return;
    setSaving(true);
    try {
      await services.whatsapp.sendReminderPlaceholder({ conversationId: selected.id, phone: selected.phone, body });
      toast.success("Placeholder WhatsApp message queued. No external API call was made.");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to queue placeholder message.");
    } finally {
      setSaving(false);
    }
  };
  return <div className="space-y-5"><PageHeader title="WhatsApp Conversations" description="Track patient chats, booking steps, handoffs and failed-message placeholders." /><Card className="p-4"><div className="grid gap-3 md:grid-cols-[1fr_auto]"><Input placeholder="New WhatsApp phone number" value={phone} onChange={(event) => setPhone(event.target.value)} /><Button loading={saving} onClick={() => void createConversation()}>Create Conversation</Button></div></Card><Card className="p-4"><div className="grid gap-3 lg:grid-cols-4"><Input placeholder="Search patient name/phone" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onChange={(e) => setStatus(e.target.value as WhatsAppConversationStatus | "all")}><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="appointment_confirmed">Appointment confirmed</option><option value="waiting_for_patient">Waiting for patient</option><option value="transferred_to_reception">Transferred</option><option value="closed">Closed</option><option value="failed">Failed</option></Select><Select><option>All sources</option><option>WhatsApp</option><option>QR</option><option>Website</option></Select><Input type="date" defaultValue="2026-07-01" /></div></Card>{loading ? <Card className="p-5 text-sm text-slate-500">Loading conversations...</Card> : <ConversationList conversations={rows} onView={setSelected} />}<Modal open={!!selected} onClose={() => setSelected(null)} title="Conversation Preview">{selected && <ConversationPreview conversation={selected} loading={saving} onTransfer={() => void transfer()} onCloseConversation={() => void closeConversation()} onSendPlaceholder={(body) => void sendPlaceholder(body)} />}</Modal></div>;
}
