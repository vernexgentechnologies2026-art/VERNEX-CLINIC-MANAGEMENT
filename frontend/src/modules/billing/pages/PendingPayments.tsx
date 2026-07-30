import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Modal, PageHeader, Select, Textarea } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import { PendingPaymentCard } from "../components/PendingPaymentCard";
import { toPendingPayment } from "../supabaseMappers";
import type { PaymentMode, PendingPayment } from "../types";

export default function PendingPayments() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<PendingPayment[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("upi");
  const [note, setNote] = useState("");

  const load = async () => {
    try {
      const summaries = await services.billing.getInvoices({ invoiceStatus: "issued" });
      const details = await Promise.all(summaries.map((invoice) => services.billing.getInvoiceById(invoice.id)));
      setRows(details.filter((detail) => detail && (detail.balance_amount ?? 0) > 0).map((detail) => toPendingPayment(detail!, detail!.patient)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load pending payments.");
    }
  };

  useEffect(() => { void load(); }, []);
  const selected = useMemo(() => rows.find((row) => row.id === invoiceId), [rows, invoiceId]);

  const savePayment = async () => {
    if (!invoiceId || Number(amount) <= 0) {
      toast.error("Select an invoice and enter a valid amount.");
      return;
    }
    try {
      await services.billing.recordManualPayment({ invoiceId, amount: Number(amount), paymentMode, paymentNote: note });
      toast.success("Manual payment recorded.");
      setOpen(false);
      setAmount("");
      setNote("");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to record payment.");
    }
  };

  return <div className="space-y-5"><PageHeader title="Pending Payments" description="Collect balances, send reminders, and record payment placeholders." action={<Button onClick={() => setOpen(true)}>Record Payment</Button>} /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((p) => <PendingPaymentCard key={p.id} payment={p} />)}</div><Modal open={open} onClose={() => setOpen(false)} title="Add Payment"><div className="space-y-3"><Select value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)}><option value="">Select invoice</option>{rows.map((row) => <option key={row.id} value={row.id}>{row.invoiceNumber} - {row.patientName} - balance {row.balance}</option>)}</Select><Input type="number" placeholder={selected ? `Amount received, max ${selected.balance}` : "Amount received"} value={amount} onChange={(event) => setAmount(event.target.value)} /><Select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value as PaymentMode)}><option value="upi">UPI</option><option value="cash">Cash</option><option value="card">Card</option><option value="online_link">Online Link</option></Select><Input type="date" defaultValue="2026-07-01" /><Textarea placeholder="Notes" value={note} onChange={(event) => setNote(event.target.value)} /><Button onClick={() => void savePayment()}>Save payment</Button></div></Modal></div>;
}
