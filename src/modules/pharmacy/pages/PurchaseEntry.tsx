import { Card, PageHeader } from "../../../components/ui";
import { getPurchaseEntries } from "../../../services/pharmacy.service";
import { PurchaseEntryForm } from "../components/PurchaseEntryForm";
import { rupee } from "../utils";
export default function PurchaseEntry() { return <div className="space-y-5"><PageHeader title="Purchase Entry" description="Add stock purchase invoices and medicine batches." /><PurchaseEntryForm /><Card className="p-5"><h2 className="font-bold">Recent purchase entries</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{getPurchaseEntries().map((p) => <div key={p.id} className="rounded-xl border p-4"><div className="flex justify-between"><b>{p.invoiceNumber}</b><b>{rupee(p.totalAmount)}</b></div><p className="text-sm text-slate-500">{p.purchaseDate} · {p.supplierName} · {p.items.length} medicines</p><p className="mt-2 text-xs font-bold text-emerald-700">{p.status}</p></div>)}</div></Card></div>; }
