import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Card, PageHeader, Select } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { Tables } from "../../../shared/types/database.types";
import { MedicineFormModal } from "../components/MedicineFormModal";
import { MedicineSearchInput } from "../components/MedicineSearchInput";
import { MedicineTable } from "../components/MedicineTable";
import { StockAdjustmentModal } from "../components/StockAdjustmentModal";
import { toMedicineRows } from "../supabaseMappers";
import type { MedicineCategory, StockStatus } from "../types";

export default function MedicineStock() {
  const [medicineRows, setMedicineRows] = useState<Tables<"medicines">[]>([]);
  const [batches, setBatches] = useState<Tables<"medicine_stock_batches">[]>([]);
  const [q, setQ] = useState(""); const [category, setCategory] = useState<MedicineCategory | "all">("all"); const [stock, setStock] = useState<StockStatus | "all">("all"); const [modal, setModal] = useState<"medicine" | "stock" | null>(null);
  const load = async () => {
    try {
      const medicines = await services.pharmacy.getMedicines({ status: "active" });
      const [fullMedicines, nextBatches] = await Promise.all([
        Promise.all(medicines.map((medicine) => services.pharmacy.getMedicineById(medicine.id))),
        services.pharmacy.getStockBatches(),
      ]);
      setMedicineRows(fullMedicines.filter(Boolean) as Tables<"medicines">[]);
      setBatches(nextBatches);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load medicine stock.");
    }
  };
  useEffect(() => { void load(); }, []);
  const rows = useMemo(() => toMedicineRows(medicineRows, batches).filter((m) => (category === "all" || m.category === category) && (stock === "all" || m.stockStatus === stock) && `${m.name} ${m.batchNumber} ${m.supplier}`.toLowerCase().includes(q.toLowerCase())), [medicineRows, batches, q, category, stock]);
  const saveMedicine = async (input: { name: string; genericName?: string; category: string; batchNumber: string; expiryDate: string; currentStock: number; reorderLevel?: number; purchasePrice?: number; sellingPrice: number; supplier?: string; gst?: number; notes?: string }) => {
    try {
      const medicine = await services.pharmacy.createMedicine({ clinic_id: "", name: input.name, generic_name: input.genericName || null, category: input.category, unit: "unit", reorder_level: input.reorderLevel ?? 0, gst_rate: input.gst ?? 0, metadata: { notes: input.notes ?? "" } });
      await services.pharmacy.addStockBatch({ clinic_id: medicine.clinic_id, branch_id: medicine.branch_id, medicine_id: medicine.id, batch_no: input.batchNumber, expiry_date: input.expiryDate, quantity_available: input.currentStock, purchase_price: input.purchasePrice ?? 0, selling_price: input.sellingPrice, supplier_name: input.supplier || null });
      toast.success("Medicine and stock batch saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save medicine.");
    }
  };
  const adjust = async (input: { batchId: string; movementType: string; quantity: number; reason?: string }) => {
    try {
      await services.pharmacy.adjustStock(input);
      toast.success("Stock adjusted.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to adjust stock.");
    }
  };
  return <div className="space-y-5"><PageHeader title="Medicine Stock" description="Complete medicine inventory with stock and expiry controls." action={<div className="flex gap-2"><Button onClick={() => setModal("medicine")}>Add medicine</Button><Button variant="secondary" onClick={() => setModal("stock")}>Stock adjustment</Button></div>} /><Card className="p-4"><div className="grid gap-3 lg:grid-cols-4"><MedicineSearchInput value={q} onChange={setQ} placeholder="Search medicine" /><Select value={category} onChange={(e) => setCategory(e.target.value as MedicineCategory | "all")}><option value="all">All categories</option><option value="general">General</option><option value="antibiotic">Antibiotic</option><option value="dental">Dental</option><option value="skin">Skin</option><option value="pediatric">Pediatric</option><option value="physiotherapy">Physiotherapy</option></Select><Select value={stock} onChange={(e) => setStock(e.target.value as StockStatus | "all")}><option value="all">All stock status</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option><option value="expired">Expired</option><option value="expiring_soon">Expiring soon</option></Select><Select><option>All expiry status</option><option>Expiring soon</option><option>Expired</option><option>Safe stock</option></Select></div></Card><Card className="p-5"><MedicineTable medicines={rows} /></Card><MedicineFormModal open={modal === "medicine"} onClose={() => setModal(null)} onSave={saveMedicine} /><StockAdjustmentModal open={modal === "stock"} onClose={() => setModal(null)} batches={batches} onAdjust={adjust} /></div>;
}
