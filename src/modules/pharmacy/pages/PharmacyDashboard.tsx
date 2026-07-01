import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "../../../components/ui";
import { clinic } from "../../../data/mockData";
import { getExpiryAlertMedicines, getLowStockMedicines, getPharmacyBills, getPharmacyStats, getPrescriptionQueue } from "../../../services/pharmacy.service";
import { ExpiryAlertCard } from "../components/ExpiryAlertCard";
import { LowStockAlertCard } from "../components/LowStockAlertCard";
import { MedicineSearchInput } from "../components/MedicineSearchInput";
import { PharmacyStatsGrid } from "../components/PharmacyStatsGrid";
import { PrescriptionQueueTable } from "../components/PrescriptionQueueTable";
import { PharmacyPaymentBadge } from "../components/StockStatusBadge";
import { rupee } from "../utils";
import { useState } from "react";

export default function PharmacyDashboard() {
  const [q, setQ] = useState("");
  return <div className="space-y-5"><PageHeader title="Good morning, Pharmacy" description={`${clinic.name} · Wednesday, 1 July 2026`} action={<Link to="/pharmacy/billing"><Button>New counter sale</Button></Link>} /><MedicineSearchInput value={q} onChange={setQ} /><PharmacyStatsGrid stats={getPharmacyStats()} /><Card className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Pending Prescription Queue</h2><Link className="text-sm font-bold text-brand-700" to="/pharmacy/prescriptions">View all</Link></div><PrescriptionQueueTable items={getPrescriptionQueue().slice(0, 3)} /></Card><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Low Stock Medicines</h2><div className="mt-4 grid gap-3">{getLowStockMedicines().slice(0, 2).map((m) => <LowStockAlertCard key={m.id} medicine={m} />)}</div></Card><Card className="p-5"><h2 className="font-bold">Expiry Alerts</h2><div className="mt-4 grid gap-3">{getExpiryAlertMedicines().slice(0, 2).map((m) => <ExpiryAlertCard key={m.id} medicine={m} />)}</div></Card></div><Card className="p-5"><h2 className="font-bold">Today Bills</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{getPharmacyBills().map((b) => <div key={b.id} className="rounded-xl border p-4"><div className="flex justify-between"><b>{b.id}</b><b>{rupee(b.total)}</b></div><p className="text-sm text-slate-500">{b.patientName} · {b.paymentMode}</p><div className="mt-2"><PharmacyPaymentBadge status={b.paymentStatus} /></div></div>)}</div></Card></div>;
}
