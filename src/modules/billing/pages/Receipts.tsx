import { useMemo, useState } from "react";
import { Button, Card, Input, Modal, PageHeader, Select } from "../../../components/ui";
import { getReceipts } from "../../../services/billing.service";
import { ReceiptPreview } from "../components/ReceiptPreview";
import { PaymentModeBadge } from "../components/PaymentModeBadge";
import type { PaymentMode, Receipt } from "../types";
import { rupee } from "../utils";

export default function Receipts() {
  const [q, setQ] = useState(""); const [mode, setMode] = useState<PaymentMode | "all">("all"); const [selected, setSelected] = useState<Receipt | null>(null);
  const rows = useMemo(() => getReceipts().filter((r) => (mode === "all" || r.paymentMode === mode) && `${r.id} ${r.patientName}`.toLowerCase().includes(q.toLowerCase())), [q, mode]);
  return <div className="space-y-5"><PageHeader title="Receipts" description="Receipt list and compact receipt previews." /><Card className="p-4"><div className="grid gap-3 md:grid-cols-4"><Input placeholder="Search receipt" value={q} onChange={(e) => setQ(e.target.value)} /><Input type="date" defaultValue="2026-07-01" /><Select value={mode} onChange={(e) => setMode(e.target.value as PaymentMode | "all")}><option value="all">All payment modes</option><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="online_link">Online Link</option></Select><Select><option>All receipt types</option><option>Consultation</option><option>Pharmacy</option></Select></div></Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((r) => <div key={r.id} className="card p-4"><div className="flex justify-between"><b>{r.id}</b><b>{rupee(r.amountPaid)}</b></div><p className="text-sm text-slate-500">{r.patientName} · {r.linkedInvoice}</p><div className="mt-2"><PaymentModeBadge mode={r.paymentMode} /></div><div className="mt-4 flex gap-2"><Button onClick={() => setSelected(r)}>View receipt</Button><Button variant="secondary">Print</Button><Button variant="ghost">WhatsApp</Button></div></div>)}</div><Modal open={!!selected} onClose={() => setSelected(null)} title="Receipt Preview">{selected && <ReceiptPreview receipt={selected} />}</Modal></div>;
}
