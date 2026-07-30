import { useMemo, useState } from "react";
import { Button, Card, PageHeader, Select } from "../../../components/ui";
import { getMedicines } from "../../../services/pharmacy.service";
import { MedicineFormModal } from "../components/MedicineFormModal";
import { MedicineSearchInput } from "../components/MedicineSearchInput";
import { MedicineTable } from "../components/MedicineTable";
import { StockAdjustmentModal } from "../components/StockAdjustmentModal";
import type { MedicineCategory, StockStatus } from "../types";

export default function MedicineStock() {
  const [q, setQ] = useState(""); const [category, setCategory] = useState<MedicineCategory | "all">("all"); const [stock, setStock] = useState<StockStatus | "all">("all"); const [modal, setModal] = useState<"medicine" | "stock" | null>(null);
  const rows = useMemo(() => getMedicines().filter((m) => (category === "all" || m.category === category) && (stock === "all" || m.stockStatus === stock) && `${m.name} ${m.batchNumber} ${m.supplier}`.toLowerCase().includes(q.toLowerCase())), [q, category, stock]);
  return <div className="space-y-5"><PageHeader title="Medicine Stock" description="Complete medicine inventory with stock and expiry controls." action={<div className="flex gap-2"><Button onClick={() => setModal("medicine")}>Add medicine</Button><Button variant="secondary" onClick={() => setModal("stock")}>Stock adjustment</Button></div>} /><Card className="p-4"><div className="grid gap-3 lg:grid-cols-4"><MedicineSearchInput value={q} onChange={setQ} placeholder="Search medicine" /><Select value={category} onChange={(e) => setCategory(e.target.value as MedicineCategory | "all")}><option value="all">All categories</option><option value="general">General</option><option value="antibiotic">Antibiotic</option><option value="dental">Dental</option><option value="skin">Skin</option><option value="pediatric">Pediatric</option><option value="physiotherapy">Physiotherapy</option></Select><Select value={stock} onChange={(e) => setStock(e.target.value as StockStatus | "all")}><option value="all">All stock status</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option><option value="expired">Expired</option><option value="expiring_soon">Expiring soon</option></Select><Select><option>All expiry status</option><option>Expiring soon</option><option>Expired</option><option>Safe stock</option></Select></div></Card><Card className="p-5"><MedicineTable medicines={rows} /></Card><MedicineFormModal open={modal === "medicine"} onClose={() => setModal(null)} /><StockAdjustmentModal open={modal === "stock"} onClose={() => setModal(null)} /></div>;
}
