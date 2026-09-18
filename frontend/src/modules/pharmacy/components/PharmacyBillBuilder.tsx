import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Select, Textarea } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { PatientRecord } from "../../../shared/types/domain";
import type { MedicineRecord } from "../../../shared/types/domain";
import type { PaymentMode, PaymentStatus, PharmacyBillItem } from "../types";
import { PharmacyBillPreview } from "./PharmacyBillPreview";
import { rupee } from "../utils";

const blankItem = (): PharmacyBillItem => ({ medicineName: "", quantity: 1, unitPrice: 0, discount: 0 });

export function PharmacyBillBuilder() {
  const [mode, setMode] = useState<PaymentMode>("upi");
  const [status, setStatus] = useState<PaymentStatus>("paid");
  const [items, setItems] = useState<PharmacyBillItem[]>([blankItem()]);
  const [notes, setNotes] = useState("");

  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<PatientRecord[]>([]);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  const [saving, setSaving] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [rows, batches] = await Promise.all([services.pharmacy.getMedicines({ status: "active" }), services.pharmacy.getStockBatches()]);
        if (!mounted) return;
        setMedicines(rows);
        // Sell at the newest batch's selling price.
        const priceByMedicine = new Map<string, number>();
        for (const batch of batches) {
          if (batch.selling_price != null) priceByMedicine.set(batch.medicine_id, batch.selling_price);
        }
        setPrices(new Map(rows.map((medicine) => [medicine.name, priceByMedicine.get(medicine.id) ?? 0])));
      } catch {
        // The bill can still be typed manually if the catalogue is unavailable.
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const term = patientQuery.trim();
    if (term.length < 2 || patient) { setPatientResults([]); return; }
    let mounted = true;
    const timer = setTimeout(() => {
      void services.patients.searchPatients(term).then((rows) => { if (mounted) setPatientResults(rows.slice(0, 6)); }).catch(() => undefined);
    }, 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [patient, patientQuery]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [items]);
  const discount = useMemo(() => items.reduce((sum, item) => sum + item.discount, 0), [items]);
  const total = subtotal - discount;

  const update = (index: number, patch: Partial<PharmacyBillItem>) =>
    setItems((rows) => rows.map((row, i) => i === index ? { ...row, ...row, ...patch } : row));

  const pickMedicine = (index: number, name: string) => {
    update(index, { medicineName: name, unitPrice: prices.get(name) ?? items[index].unitPrice });
  };

  const generate = async () => {
    const billItems = items.filter((item) => item.medicineName.trim() && item.quantity > 0);
    if (!patient) return toast.error("Select the patient for this bill.");
    if (billItems.length === 0) return toast.error("Add at least one medicine.");
    setSaving(true);
    try {
      const context = await services.auth.getCurrentAuthContext();
      const paidAmount = status === "paid" ? total : status === "partial" ? Math.round(total / 2) : 0;
      const created = await services.billing.createInvoice({
        invoice: {
          clinic_id: context.clinic_id || patient.clinicId,
          branch_id: context.branch_id || patient.branchId || null,
          patient_id: patient.id,
          invoice_type: "pharmacy",
          paid_amount: paidAmount,
          payment_mode: mode,
          notes,
          invoice_status: "issued",
          metadata: { source: "pharmacy_counter" },
        },
        items: billItems.map((item) => ({
          item_type: "pharmacy",
          description: item.medicineName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount_amount: item.discount,
          tax_amount: 0,
          tax_rate: 0,
        })),
      });
      setSavedInvoice(created.invoice_number);
      toast.success(`Pharmacy bill ${created.invoice_number} generated.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to generate the pharmacy bill.");
    } finally {
      setSaving(false);
    }
  };

  const sendBill = async () => {
    if (!savedInvoice) return toast.error("Generate the bill before sending it.");
    if (!patient?.phone) return toast.error("This patient has no phone number on record.");
    try {
      await services.whatsapp.sendInvoicePlaceholder({
        phone: patient.whatsappNumber || patient.phone,
        patientId: patient.id,
        body: `Hello ${patient.fullName}, your pharmacy bill ${savedInvoice} for ${rupee(total)} is ready.`,
        metadata: { type: "pharmacy_bill", invoice_number: savedInvoice },
      });
      toast.success("Bill queued for WhatsApp delivery.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to queue the bill.");
    }
  };

  return <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
    <div className="card p-5">
      <h2 className="font-bold">Generate Pharmacy Bill</h2>
      <div className="mt-4 grid gap-3">
        <div className="relative">
          <Input
            value={patient ? `${patient.fullName} · ${patient.phone}` : patientQuery}
            onChange={(event) => { setPatient(null); setPatientQuery(event.target.value); }}
            placeholder="Search patient by name or phone"
          />
          {!patient && patientResults.length > 0 && <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-white shadow-card">
            {patientResults.map((row) => <button key={row.id} type="button" onClick={() => { setPatient(row); setPatientResults([]); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50">
              <b>{row.fullName}</b><span className="ml-2 text-slate-500">{row.phone}</span>
            </button>)}
          </div>}
        </div>
      </div>

      <div className="mt-4 space-y-3">{items.map((item, index) => <div key={index} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_90px_120px_120px_auto]">
        <Select value={item.medicineName} onChange={(event) => pickMedicine(index, event.target.value)} aria-label="Medicine">
          <option value="">Select medicine</option>
          {medicines.map((medicine) => <option key={medicine.id} value={medicine.name}>{medicine.name}</option>)}
        </Select>
        <Input type="number" min={1} value={item.quantity} onChange={(event) => update(index, { quantity: Number(event.target.value) })} aria-label="Quantity" />
        <Input type="number" min={0} value={item.unitPrice} onChange={(event) => update(index, { unitPrice: Number(event.target.value) })} aria-label="Unit price" />
        <Input type="number" min={0} value={item.discount} onChange={(event) => update(index, { discount: Number(event.target.value) })} aria-label="Discount" />
        <Button type="button" variant="ghost" disabled={items.length === 1} onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 className="size-4" /></Button>
      </div>)}</div>

      <Button className="mt-3" variant="secondary" onClick={() => setItems([...items, blankItem()])}>Add medicine</Button>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Select value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)} aria-label="Payment mode">
          <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="online_link">Online Link</option>
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus)} aria-label="Payment status">
          <option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option>
        </Select>
        <Textarea className="md:col-span-2" placeholder="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-right text-lg font-bold">Total {rupee(total)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button loading={saving} onClick={() => void generate()}>Generate bill</Button>
        <Button variant="secondary" onClick={() => window.print()}>Print bill</Button>
        <Button variant="secondary" disabled={!savedInvoice} onClick={() => void sendBill()}>Send bill to WhatsApp</Button>
        {savedInvoice && <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">Saved as {savedInvoice}</span>}
      </div>
    </div>
    <PharmacyBillPreview items={items} paymentMode={mode} paymentStatus={status} patientName={patient?.fullName ?? ""} />
  </div>;
}
