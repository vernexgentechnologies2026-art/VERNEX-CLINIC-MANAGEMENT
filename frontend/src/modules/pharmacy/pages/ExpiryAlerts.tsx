import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, PageHeader } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";
import type { Tables } from "../../../shared/types/database.types";
import { ExpiryAlertCard } from "../components/ExpiryAlertCard";
import { toMedicineRows } from "../supabaseMappers";
import type { ExpiryStatus } from "../types";

export default function ExpiryAlerts() {
  const [tab, setTab] = useState<ExpiryStatus>("expiring_soon");
  const [medicineRows, setMedicineRows] = useState<Tables<"medicines">[]>([]);
  const [batches, setBatches] = useState<Tables<"medicine_stock_batches">[]>([]);

  useEffect(() => {
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
        toast.error(error instanceof Error ? error.message : "Unable to load expiry alerts.");
      }
    };
    void load();
  }, []);

  const rows = useMemo(() => toMedicineRows(medicineRows, batches).filter((m) => m.expiryStatus === tab), [medicineRows, batches, tab]);

  return <div className="space-y-5"><PageHeader title="Expiry Alerts" description="Track expiring soon, expired, and safe medicine batches." /><div className="flex flex-wrap gap-2"><Button variant={tab === "expiring_soon" ? "primary" : "secondary"} onClick={() => setTab("expiring_soon")}>Expiring Soon</Button><Button variant={tab === "expired" ? "primary" : "secondary"} onClick={() => setTab("expired")}>Expired</Button><Button variant={tab === "safe" ? "primary" : "secondary"} onClick={() => setTab("safe")}>Safe Stock</Button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((m) => <ExpiryAlertCard key={m.id} medicine={m} />)}</div></div>;
}
