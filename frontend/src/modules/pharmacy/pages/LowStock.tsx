import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, Select } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { Tables } from "../../../shared/types/database.types";
import { LowStockAlertCard } from "../components/LowStockAlertCard";
import { toMedicineRows } from "../supabaseMappers";

export default function LowStock() {
  const [critical, setCritical] = useState(false);
  const [medicineRows, setMedicineRows] = useState<Tables<"medicines">[]>([]);
  const [batches, setBatches] = useState<Tables<"medicine_stock_batches">[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await services.auth.getCurrentAuthContext();
        await services.pharmacy.refreshLowStockAlerts(context.clinic_id ?? undefined, context.branch_id ?? undefined);
        const medicines = await services.pharmacy.getMedicines({ status: "active" });
        const [fullMedicines, nextBatches] = await Promise.all([
          Promise.all(medicines.map((medicine) => services.pharmacy.getMedicineById(medicine.id))),
          services.pharmacy.getStockBatches(),
        ]);
        setMedicineRows(fullMedicines.filter(Boolean) as Tables<"medicines">[]);
        setBatches(nextBatches);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load low-stock alerts.");
      }
    };
    void load();
  }, []);

  const rows = useMemo(() => toMedicineRows(medicineRows, batches).filter((m) => (m.stockStatus === "low_stock" || m.stockStatus === "out_of_stock") && (!critical || m.currentStock === 0 || m.currentStock < m.reorderLevel / 2)), [medicineRows, batches, critical]);

  return <div className="space-y-5"><PageHeader title="Low Stock" description="Medicines below reorder level with suggested purchase actions." /><Card className="p-4"><div className="grid gap-3 md:grid-cols-3"><Select><option>All categories</option><option>General</option><option>Antibiotic</option></Select><Select><option>All suppliers</option><option>MedPlus Bengaluru Wholesale</option></Select><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={critical} onChange={(e) => setCritical(e.target.checked)} /> Critical only</label></div></Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((m) => <LowStockAlertCard key={m.id} medicine={m} />)}</div></div>;
}
