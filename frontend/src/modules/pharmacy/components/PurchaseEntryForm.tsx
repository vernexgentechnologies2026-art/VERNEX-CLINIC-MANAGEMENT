import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Textarea } from "../../../components/ui";
import { MedicineSearchInput } from "./MedicineSearchInput";
import { rupee } from "../utils";

export type PurchaseEntryItemInput = {
  key: string;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
};

export type PurchaseEntryFormInput = {
  supplierName: string;
  supplierPhone?: string;
  invoiceNumber: string;
  purchaseDate: string;
  notes?: string;
  items: Array<Omit<PurchaseEntryItemInput, "key">>;
};

const blankItem = (): PurchaseEntryItemInput => ({ key: crypto.randomUUID(), medicineName: "", batchNumber: "", expiryDate: "", quantity: 1, purchasePrice: 0, sellingPrice: 0, mrp: 0 });

export function PurchaseEntryForm({ onSave, saving = false }: { onSave?: (input: PurchaseEntryFormInput) => Promise<void> | void; saving?: boolean }) {
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseEntryItemInput[]>([blankItem()]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0), [items]);

  const reset = () => {
    setSupplierName(""); setSupplierPhone(""); setInvoiceNumber("");
    setPurchaseDate(new Date().toISOString().slice(0, 10));
    setNotes(""); setItems([blankItem()]);
  };

  const update = (key: string, patch: Partial<PurchaseEntryItemInput>) => setItems((rows) => rows.map((row) => row.key === key ? { ...row, ...patch } : row));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (supplierName.trim().length < 2) return toast.error("Enter the supplier name.");
    if (!invoiceNumber.trim()) return toast.error("Enter the purchase invoice number.");
    const filled = items.filter((item) => item.medicineName.trim() && item.batchNumber.trim());
    if (filled.length === 0) return toast.error("Add at least one medicine with a batch number.");
    if (filled.some((item) => item.quantity <= 0)) return toast.error("Each medicine needs a quantity of at least 1.");

    await onSave?.({
      supplierName: supplierName.trim(),
      supplierPhone: supplierPhone.trim() || undefined,
      invoiceNumber: invoiceNumber.trim(),
      purchaseDate,
      notes: notes.trim() || undefined,
      items: filled.map(({ key: _key, ...item }) => item),
    });
    reset();
  };

  return <form onSubmit={submit} className="card p-5">
    <h2 className="font-bold">Stock Purchase Entry</h2>
    <div className="mt-4 grid gap-3 md:grid-cols-4">
      <Input value={supplierName} onChange={(event) => setSupplierName(event.target.value)} placeholder="Supplier name" />
      <Input value={supplierPhone} onChange={(event) => setSupplierPhone(event.target.value)} placeholder="Supplier phone" />
      <Input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} placeholder="Purchase invoice number" />
      <Input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} />
    </div>

    <div className="mt-4 space-y-3">
      {items.map((item) => <div key={item.key} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1.3fr_.8fr_.9fr_.6fr_.7fr_.7fr_.7fr_auto]">
        <MedicineSearchInput value={item.medicineName} onChange={(value) => update(item.key, { medicineName: value })} />
        <Input value={item.batchNumber} onChange={(event) => update(item.key, { batchNumber: event.target.value })} placeholder="Batch number" />
        <Input type="date" value={item.expiryDate} onChange={(event) => update(item.key, { expiryDate: event.target.value })} aria-label="Expiry date" />
        <Input type="number" min={1} value={item.quantity} onChange={(event) => update(item.key, { quantity: Number(event.target.value) })} placeholder="Qty" />
        <Input type="number" min={0} value={item.purchasePrice} onChange={(event) => update(item.key, { purchasePrice: Number(event.target.value) })} placeholder="Purchase" />
        <Input type="number" min={0} value={item.sellingPrice} onChange={(event) => update(item.key, { sellingPrice: Number(event.target.value) })} placeholder="Selling" />
        <Input type="number" min={0} value={item.mrp} onChange={(event) => update(item.key, { mrp: Number(event.target.value) })} placeholder="MRP" />
        <Button type="button" variant="ghost" disabled={items.length === 1} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key))}><Trash2 className="size-4" /></Button>
      </div>)}
    </div>

    <Textarea className="mt-3" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" />
    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-bold">Total purchase cost: {rupee(total)}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      <Button type="button" variant="secondary" onClick={() => setItems((rows) => [...rows, blankItem()])}>Add medicine row</Button>
      <Button type="submit" loading={saving}>Save purchase entry</Button>
      <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
    </div>
  </form>;
}
