import { useMemo, useState } from "react";
import { Button } from "../../../components/ui";
import { getPatientBills, getPatientPortalProfile } from "../../../services/patientPortal.service";
import { BillCard } from "../components/BillCard";
import { PatientEmptyState } from "../components/PatientEmptyState";
import { ReceiptDetailModal } from "../components/ReceiptDetailModal";
import type { PatientBill, PatientBillStatus } from "../types";

type Tab = PatientBillStatus | "all";

export default function MyBills() {
  const [tab, setTab] = useState<Tab>("all");
  const [selected, setSelected] = useState<PatientBill | null>(null);
  const bills = getPatientBills();
  const rows = useMemo(() => bills.filter((bill) => tab === "all" || bill.status === tab), [bills, tab]);
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div><h1 className="text-2xl font-bold">My Bills</h1><p className="text-sm text-slate-500">View receipts, payments, and pending balances.</p></div><div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-2 shadow-card">{(["all", "paid", "pending", "partial"] as Tab[]).map((item) => <Button key={item} variant={tab === item ? "primary" : "ghost"} onClick={() => setTab(item)}>{item.replace(/\b\w/g, (c) => c.toUpperCase())}</Button>)}</div>{rows.length === 0 ? <PatientEmptyState title="No bills" description="Bills and receipts will appear here after payment." /> : <div className="space-y-3">{rows.map((bill) => <BillCard key={bill.id} bill={bill} onView={setSelected} />)}</div>}<ReceiptDetailModal bill={selected} onClose={() => setSelected(null)} patientName={getPatientPortalProfile().name} /></div>;
}
