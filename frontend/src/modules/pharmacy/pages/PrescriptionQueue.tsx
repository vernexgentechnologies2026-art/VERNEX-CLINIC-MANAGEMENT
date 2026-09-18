import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Card, Input, Modal, PageHeader, Select } from "../../../components/ui";
import type { PharmacyQueueItem } from "../../../services/interfaces";
import { services } from "../../../services/serviceProvider";
import type { Tables } from "../../../shared/types/database.types";
import { PrescriptionQueueTable } from "../components/PrescriptionQueueTable";
import { StockStatusBadge } from "../components/StockStatusBadge";
import { toPrescriptionQueueItem } from "../supabaseMappers";
import type { PaymentStatus, PrescriptionQueueItem, PrescriptionStatus } from "../types";

export default function PrescriptionQueue() {
  const [orders, setOrders] = useState<PharmacyQueueItem[]>([]);
  const [batches, setBatches] = useState<Tables<"medicine_stock_batches">[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PrescriptionStatus | "all">("all");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [selected, setSelected] = useState<PrescriptionQueueItem | null>(null);

  const load = async () => {
    try {
      const routed = await services.doctor.getPrescriptions({ pharmacyStatus: "sent_to_pharmacy" });
      await Promise.all(routed.map((rx) => services.pharmacy.createOrderFromPrescription(rx.id).catch(() => null)));
      const [nextOrders, nextBatches] = await Promise.all([services.pharmacy.getPharmacyQueue(), services.pharmacy.getStockBatches()]);
      setOrders(nextOrders);
      setBatches(nextBatches);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load pharmacy queue.");
    }
  };

  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => orders.map(toPrescriptionQueueItem).filter((rx) => (status === "all" || rx.status === status) && (payment === "all" || rx.paymentStatus === payment) && `${rx.token} ${rx.patientName} ${rx.doctorName}`.toLowerCase().includes(query.toLowerCase())), [orders, query, status, payment]);

  const dispenseSelected = async () => {
    if (!selected) return;
    const order = orders.find((item) => item.id === selected.id);
    if (!order) return;
    const today = new Date().toISOString().slice(0, 10);
    const dispenseItems = order.items.flatMap((item) => {
      if (!item.medicine_id || item.status === "dispensed") return [];
      const batch = batches.find((row) => row.medicine_id === item.medicine_id && row.status === "active" && (row.quantity_available ?? 0) > 0 && (!row.expiry_date || row.expiry_date >= today));
      const quantity = Math.max((item.requested_quantity ?? 1) - (item.dispensed_quantity ?? 0), 1);
      return batch ? [{ orderItemId: item.id, batchId: batch.id, quantity }] : [];
    });
    if (dispenseItems.length === 0) {
      toast.error("No valid stock batch is available for this order.");
      return;
    }
    try {
      await services.pharmacy.dispenseOrder({ orderId: order.id, items: dispenseItems });
      toast.success("Pharmacy order dispensed.");
      setSelected(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to dispense pharmacy order.");
    }
  };

  const createInvoice = async () => {
    if (!selected) return;
    try {
      await services.billing.createInvoiceFromPharmacyOrder(selected.id);
      toast.success("Pharmacy invoice created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create pharmacy invoice.");
    }
  };

  return <div className="space-y-5"><PageHeader title="Prescription Queue" description="Bill and dispense prescriptions sent by doctors." action={<Button variant="secondary" onClick={() => void load()}>Refresh queue</Button>} /><Card className="p-4"><div className="grid gap-3 lg:grid-cols-4"><Input className="lg:col-span-2" placeholder="Search by patient, doctor or token" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onChange={(e) => setStatus(e.target.value as PrescriptionStatus | "all")}><option value="all">All status</option><option value="pending">Pending</option><option value="billed">Billed</option><option value="partially_dispensed">Partially dispensed</option><option value="dispensed">Dispensed</option><option value="cancelled">Cancelled</option></Select><Select value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus | "all")}><option value="all">All payment</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option></Select></div></Card><Card className="p-5"><PrescriptionQueueTable items={rows} onView={setSelected} /></Card><Modal open={!!selected} onClose={() => setSelected(null)} title="Prescription detail">{selected && <div className="space-y-4"><div><b>{selected.patientName}</b><p className="text-sm text-slate-500">{selected.doctorName} - {selected.diagnosis}</p></div>{selected.medicines.map((m) => <div key={m.medicineName} className="rounded-xl border p-3"><div className="flex justify-between"><b>{m.medicineName}</b><StockStatusBadge status={m.availability} /></div><p className="mt-1 text-sm text-slate-500">{m.dosage} - {m.frequency} - {m.timing} - {m.duration}</p>{m.instructions && <p className="text-xs text-slate-400">{m.instructions}</p>}</div>)}<div className="flex flex-wrap gap-2"><Button onClick={() => void dispenseSelected()}>Dispense available stock</Button><Button variant="secondary" onClick={() => void createInvoice()}>Create pharmacy bill</Button><Button variant="secondary" onClick={() => window.print()}>Print</Button></div></div>}</Modal></div>;
}
