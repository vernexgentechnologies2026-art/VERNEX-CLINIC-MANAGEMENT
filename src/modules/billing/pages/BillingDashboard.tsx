import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input, PageHeader } from "../../../components/ui";
import { getBillingStats, getInvoices, getPendingPayments, getRevenueReport } from "../../../services/billing.service";
import { BillingStatsGrid } from "../components/BillingStatsGrid";
import { InvoiceTable } from "../components/InvoiceTable";
import { PendingPaymentCard } from "../components/PendingPaymentCard";
import { RevenueChart } from "../components/RevenueChart";
import { TopServicesTable } from "../components/TopServicesTable";
import { PaymentModeBadge } from "../components/PaymentModeBadge";
import { rupee } from "../utils";

const clinicName = "Vernex Multispeciality Clinic";
export default function BillingDashboard() {
  const [q, setQ] = useState("");
  const report = getRevenueReport();
  return <div className="space-y-5"><PageHeader title="Billing Overview" description={`${clinicName} · Wednesday, 1 July 2026`} action={<Link to="/billing/create"><Button>Create Bill</Button></Link>} /><Input placeholder="Search by patient, phone, bill number" value={q} onChange={(e) => setQ(e.target.value)} /><BillingStatsGrid stats={getBillingStats()} /><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><Card className="p-5"><h2 className="font-bold">Revenue Trend</h2><RevenueChart data={report.trend} /></Card><Card className="p-5"><h2 className="font-bold">Payment Mode Split</h2><div className="mt-4 space-y-3">{report.paymentModes.map((m) => <div key={m.mode} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><PaymentModeBadge mode={m.mode} /><b>{rupee(m.amount)}</b></div>)}</div></Card></div><Card className="p-5"><div className="mb-4 flex justify-between"><h2 className="font-bold">Recent Invoices</h2><Link className="text-sm font-bold text-brand-700" to="/billing/invoices">View all</Link></div><InvoiceTable invoices={getInvoices()} /></Card><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Pending Payments</h2><div className="mt-4 space-y-3">{getPendingPayments().map((p) => <PendingPaymentCard key={p.id} payment={p} />)}</div></Card><Card className="p-5"><h2 className="font-bold">Top Services</h2><TopServicesTable rows={report.topServices} /></Card></div></div>;
}
