import { toast } from "sonner";
import { Card, PageHeader } from "../../../components/ui";
import { getPurchaseEntries } from "../../../services/pharmacy.service";
import { services } from "../../../services/serviceProvider";
import { PurchaseEntryForm } from "../components/PurchaseEntryForm";
import { rupee } from "../utils";

export default function PurchaseEntry() {
  const save = async (input: { supplierName: string; invoiceNumber: string; purchaseDate: string; medicineName: string; batchNumber: string; expiryDate: string; quantity: number; purchasePrice: number; sellingPrice: number; notes?: string }) => {
    try {
      const existing = await services.pharmacy.getMedicines({ query: input.medicineName, status: "active" });
      const fullExisting = existing[0] ? await services.pharmacy.getMedicineById(existing[0].id) : null;
      const medicine = fullExisting ?? await services.pharmacy.createMedicine({ clinic_id: "", name: input.medicineName, category: "general", unit: "unit", metadata: { notes: input.notes ?? "" } });
      await services.pharmacy.addStockBatch({ clinic_id: medicine.clinic_id, branch_id: medicine.branch_id, medicine_id: medicine.id, batch_no: input.batchNumber, expiry_date: input.expiryDate, quantity_available: input.quantity, purchase_price: input.purchasePrice, selling_price: input.sellingPrice, supplier_name: input.supplierName });
      toast.success("Purchase stock batch saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save purchase entry.");
    }
  };

  return <div className="space-y-5"><PageHeader title="Purchase Entry" description="Add stock purchase invoices and medicine batches." /><PurchaseEntryForm onSave={save} /><Card className="p-5"><h2 className="font-bold">Recent purchase entries</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{getPurchaseEntries().map((p) => <div key={p.id} className="rounded-xl border p-4"><div className="flex justify-between"><b>{p.invoiceNumber}</b><b>{rupee(p.totalAmount)}</b></div><p className="text-sm text-slate-500">{p.purchaseDate} - {p.supplierName} - {p.items.length} medicines</p><p className="mt-2 text-xs font-bold text-emerald-700">{p.status}</p></div>)}</div></Card></div>;
}
