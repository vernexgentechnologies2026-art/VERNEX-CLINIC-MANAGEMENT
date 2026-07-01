import { useMemo, useState } from "react";
import { Card, Input, PageHeader, Select } from "../../../components/ui";
import { getWhatsAppTemplates } from "../../../services/whatsappBooking.service";
import { TemplateEditorModal } from "../components/TemplateEditorModal";
import { TemplateMessageCard } from "../components/TemplateMessageCard";
import { WhatsAppEmptyState } from "../components/WhatsAppEmptyState";
import type { WhatsAppTemplate, WhatsAppTemplateStatus } from "../types";

export default function WhatsAppTemplates() {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState<WhatsAppTemplateStatus | "all">("all"); const [selected, setSelected] = useState<WhatsAppTemplate | null>(null);
  const rows = useMemo(() => getWhatsAppTemplates().filter((template) => (status === "all" || template.status === status) && `${template.name} ${template.category}`.toLowerCase().includes(query.toLowerCase())), [query, status]);
  return <div className="space-y-5"><PageHeader title="WhatsApp Templates" description="Manage demo templates for future official WhatsApp API approval." /><Card className="p-4"><div className="grid gap-3 md:grid-cols-[1fr_240px]"><Input placeholder="Search templates" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onChange={(e) => setStatus(e.target.value as WhatsAppTemplateStatus | "all")}><option value="all">All statuses</option><option value="active">Active</option><option value="draft">Draft</option><option value="needs_api_approval">Needs API approval</option><option value="disabled">Disabled</option></Select></div></Card>{rows.length === 0 ? <WhatsAppEmptyState title="No templates found" description="Try a different search term or template status." /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((template) => <TemplateMessageCard key={template.id} template={template} onEdit={() => setSelected(template)} />)}</div>}<TemplateEditorModal template={selected} onClose={() => setSelected(null)} /></div>;
}
