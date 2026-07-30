import { Button } from "../../../components/ui";
import type { Medicine } from "../types";
import { rupee } from "../utils";
import { StockStatusBadge } from "./StockStatusBadge";
export function MedicineStockCard({ medicine }: { medicine: Medicine }) { return <div className="card p-4"><div className="flex justify-between gap-3"><div><h3 className="font-bold">{medicine.name}</h3><p className="text-xs text-slate-500">{medicine.genericName} · Batch {medicine.batchNumber}</p></div><StockStatusBadge status={medicine.stockStatus} /></div><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><p>Stock: <b>{medicine.currentStock}</b></p><p>Reorder: <b>{medicine.reorderLevel}</b></p><p>Expiry: <b>{medicine.expiryDate}</b></p><p>MRP: <b>{rupee(medicine.mrp)}</b></p></div><p className="mt-2 text-xs text-slate-500">{medicine.supplier}</p><div className="mt-4 flex gap-2"><Button variant="secondary">Adjust stock</Button><Button variant="ghost">Edit</Button></div></div>; }
