import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card, PageHeader } from "../../../components/ui";
import { getPharmacyBills } from "../../../services/pharmacy.service";
import type { PharmacyQueueItem } from "../../../services/interfaces";
import { services } from "../../../services/serviceProvider";
import type { Tables } from "../../../shared/types/database.types";
import { ExpiryAlertCard } from "../components/ExpiryAlertCard";
import { LowStockAlertCard } from "../components/LowStockAlertCard";
import { MedicineSearchInput } from "../components/MedicineSearchInput";
import { PharmacyStatsGrid } from "../components/PharmacyStatsGrid";
import { PrescriptionQueueTable } from "../components/PrescriptionQueueTable";
import { PharmacyPaymentBadge } from "../components/StockStatusBadge";
import { toMedicineRows, toPrescriptionQueueItem } from "../supabaseMappers";
import { rupee } from "../utils";

const clinicName = "Vernex Multispeciality Clinic";

export default function PharmacyDashboard() {
  const [q, setQ] = useState("");
  const [medicineRows, setMedicineRows] = useState<Tables<"medicines">[]>([]);
  const [batches, setBatches] = useState<Tables<"medicine_stock_batches">[]>([]);
  const [orders, setOrders] = useState<PharmacyQueueItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const medicines = await services.pharmacy.getMedicines({ status: "active" });
        const [fullMedicines, nextBatches, nextOrders] = await Promise.all([
          Promise.all(medicines.map((medicine) => services.pharmacy.getMedicineById(medicine.id))),
          services.pharmacy.getStockBatches(),
          services.pharmacy.getPharmacyQueue(),
        ]);
        setMedicineRows(fullMedicines.filter(Boolean) as Tables<"medicines">[]);
        setBatches(nextBatches);
        setOrders(nextOrders);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load pharmacy dashboard.");
      }
    };
    void load();
  }, []);

  const medicines = useMemo(() => toMedicineRows(medicineRows, batches), [medicineRows, batches]);
  const lowStock = medicines.filter((m) => m.stockStatus === "low_stock" || m.stockStatus === "out_of_stock");
  const expiryAlerts = medicines.filter((m) => m.expiryStatus !== "safe" || m.stockStatus === "expired");
  const queue = orders.map(toPrescriptionQueueItem);
  const stats = {
    pendingPrescriptions: queue.filter((item) => item.status === "pending").length,
    todaySales: 0,
    lowStock: lowStock.length,
    expiringSoon: expiryAlerts.filter((item) => item.expiryStatus === "expiring_soon").length,
    outOfStock: medicines.filter((item) => item.stockStatus === "out_of_stock").length,
    billsToday: getPharmacyBills().length,
  };

  return <div className="space-y-5"><PageHeader title="Good morning, Pharmacy" description={`${clinicName} - Wednesday, 1 July 2026`} action={<Link to="/pharmacy/billing"><Button>New counter sale</Button></Link>} /><MedicineSearchInput value={q} onChange={setQ} /><PharmacyStatsGrid stats={stats} /><Card className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Pending Prescription Queue</h2><Link className="text-sm font-bold text-brand-700" to="/pharmacy/prescriptions">View all</Link></div><PrescriptionQueueTable items={queue.filter((item) => `${item.patientName} ${item.doctorName} ${item.token}`.toLowerCase().includes(q.toLowerCase())).slice(0, 3)} /></Card><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Low Stock Medicines</h2><div className="mt-4 grid gap-3">{lowStock.slice(0, 2).map((m) => <LowStockAlertCard key={m.id} medicine={m} />)}</div></Card><Card className="p-5"><h2 className="font-bold">Expiry Alerts</h2><div className="mt-4 grid gap-3">{expiryAlerts.slice(0, 2).map((m) => <ExpiryAlertCard key={m.id} medicine={m} />)}</div></Card></div><Card className="p-5"><h2 className="font-bold">Today Bills</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{getPharmacyBills().map((b) => <div key={b.id} className="rounded-xl border p-4"><div className="flex justify-between"><b>{b.id}</b><b>{rupee(b.total)}</b></div><p className="text-sm text-slate-500">{b.patientName} - {b.paymentMode}</p><div className="mt-2"><PharmacyPaymentBadge status={b.paymentStatus} /></div></div>)}</div></Card></div>;
}
