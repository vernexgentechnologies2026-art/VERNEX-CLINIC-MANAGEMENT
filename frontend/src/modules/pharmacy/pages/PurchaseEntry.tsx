import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import { PurchaseEntryForm, type PurchaseEntryFormInput } from "../components/PurchaseEntryForm";
import { PharmacyEmptyState } from "../components/PharmacyEmptyState";
import type { PurchaseEntry as PurchaseEntryRecord } from "../types";
import { rupee } from "../utils";

export default function PurchaseEntry() {
  const [entries, setEntries] = useState<PurchaseEntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setEntries(await services.catalog.getPurchaseEntries());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load purchase entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (input: PurchaseEntryFormInput) => {
    setSaving(true);
    try {
      await services.catalog.createPurchaseEntry(input);
      toast.success("Purchase entry saved and stock updated.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save the purchase entry.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader title="Purchase Entry" description="Record supplier invoices; every medicine row creates or tops up a stock batch." />
    <PurchaseEntryForm onSave={save} saving={saving} />
    <Card className="p-5">
      <h2 className="font-bold">Recent purchase entries</h2>
      {loading ? <p className="mt-4 text-sm text-slate-500">Loading purchase history...</p>
        : entries.length === 0 ? <div className="mt-4"><PharmacyEmptyState title="No purchase entries yet" description="Saved supplier invoices will appear here." /></div>
        : <div className="mt-4 grid gap-3 md:grid-cols-2">{entries.map((entry) => <div key={entry.id} className="rounded-xl border p-4">
            <div className="flex justify-between"><b>{entry.invoiceNumber}</b><b>{rupee(entry.totalAmount)}</b></div>
            <p className="text-sm text-slate-500">{entry.purchaseDate} - {entry.supplierName} - {entry.items.length} medicine{entry.items.length === 1 ? "" : "s"}</p>
            <p className="mt-2 text-xs font-bold uppercase text-emerald-700">{entry.status}</p>
          </div>)}</div>}
    </Card>
  </div>;
}
