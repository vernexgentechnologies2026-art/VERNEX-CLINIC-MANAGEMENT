import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Card, Input, Select, Textarea } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { BillItem, BillType, PaymentMode, PaymentStatus } from "../types";
import { rupee } from "../utils";
import { BillItemRow } from "./BillItemRow";
import { InvoicePreview } from "./InvoicePreview";

const schema = z.object({ patient: z.string().min(2), billType: z.string().min(1), paymentStatus: z.string().min(1) });
const blank = (): BillItem => ({ id: crypto.randomUUID(), name: "", category: "", quantity: 1, unitPrice: 0, discount: 0, tax: 0 });

export function BillBuilder() {
  const [items, setItems] = useState<BillItem[]>([{ ...blank(), name: "General Consultation", category: "Consultation", unitPrice: 600 }]);
  const [billType, setBillType] = useState<BillType>("consultation");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("upi");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("paid");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, getValues } = useForm({ resolver: zodResolver(schema), defaultValues: { patient: "Neha Iyer", billType, paymentStatus } });

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discount = items.reduce((s, i) => s + i.discount, 0);
  const tax = items.reduce((s, i) => s + i.tax, 0);
  const total = subtotal - discount + tax;
  const paidAmount = paymentStatus === "paid" ? total : paymentStatus === "partial" ? Math.round(total / 2) : 0;
  const invoice = { id: "INV-DRAFT", patientName: getValues("patient") || "Patient", phone: "", doctorName: "Dr. Priya Sharma", billType, items, subtotal, discount, tax, total, paidAmount, balance: total - paidAmount, paymentStatus, paymentMode, date: "2026-07-01 12:30 PM" };

  const save = async () => {
    const billItems = items.filter((item) => item.name.trim());
    if (billItems.length === 0) {
      toast.error("Add at least one bill item.");
      return;
    }
    setSaving(true);
    try {
      const patients = await services.patients.searchPatients(getValues("patient"));
      const patient = patients[0];
      if (!patient) throw new Error("Select an existing patient before saving a bill.");
      const context = await services.auth.getCurrentAuthContext();
      await services.billing.createInvoice({
        invoice: {
          clinic_id: context.clinic_id || patient.clinicId,
          branch_id: context.branch_id || patient.branchId || null,
          patient_id: patient.id,
          invoice_type: billType,
          paid_amount: paidAmount,
          payment_mode: paymentMode,
          notes,
          invoice_status: paymentStatus === "cancelled" ? "draft" : "issued",
          metadata: { source: "billing_builder" },
        },
        items: billItems.map((item) => ({
          item_type: billType,
          description: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount_amount: item.discount,
          tax_amount: item.tax,
          tax_rate: 0,
        })),
      });
      toast.success("Invoice saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit(() => void save())} className="grid gap-5 xl:grid-cols-[1fr_.9fr]"><Card className="p-5"><h2 className="font-bold">Create Bill</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><Input {...register("patient")} placeholder="Patient search/select" /><Input placeholder="Doctor optional" defaultValue="Dr. Priya Sharma" /><Select value={billType} onChange={(e) => setBillType(e.target.value as BillType)}><option value="consultation">Consultation</option><option value="procedure">Procedure / Service</option><option value="pharmacy">Pharmacy</option><option value="package">Package</option><option value="other">Other</option></Select><Input type="date" defaultValue="2026-07-01" /><Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="online_link">Online Link</option></Select><Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}><option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option><option value="refunded">Refunded</option><option value="cancelled">Cancelled</option></Select></div><div className="mt-4 space-y-3">{items.map((item) => <BillItemRow key={item.id} item={item} onChange={(next) => setItems(items.map((i) => i.id === next.id ? next : i))} onRemove={() => setItems(items.filter((i) => i.id !== item.id))} />)}</div><Button type="button" variant="secondary" className="mt-3" onClick={() => setItems([...items, blank()])}>Add item</Button><Textarea className="mt-4" placeholder="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} /><div className="mt-4 rounded-xl bg-slate-50 p-4 text-right"><p>Subtotal {rupee(subtotal)} - Discount {rupee(discount)} - Tax {rupee(tax)}</p><p className="text-xl font-bold">Total {rupee(total)}</p></div><div className="mt-4 flex flex-wrap gap-2"><Button loading={saving} type="submit">Save Bill</Button><Button variant="secondary">Generate Receipt Preview</Button><Button variant="secondary">Send Payment Link</Button><Button variant="secondary">Send Receipt to WhatsApp</Button><Button variant="ghost">Print</Button></div></Card><InvoicePreview invoice={invoice} /></form>;
}
