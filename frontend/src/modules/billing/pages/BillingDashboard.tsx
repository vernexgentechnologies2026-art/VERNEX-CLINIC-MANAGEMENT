import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Card, Input, PageHeader } from "../../../components/ui";
import { getRevenueReport } from "../../../services/billing.service";
import { services } from "../../../services/serviceProvider";
import { BillingStatsGrid } from "../components/BillingStatsGrid";
import { InvoiceTable } from "../components/InvoiceTable";
import { PaymentModeBadge } from "../components/PaymentModeBadge";
import { PendingPaymentCard } from "../components/PendingPaymentCard";
import { RevenueChart } from "../components/RevenueChart";
import { TopServicesTable } from "../components/TopServicesTable";
import { toInvoice, toPendingPayment } from "../supabaseMappers";
import type { Invoice, PendingPayment } from "../types";
import { rupee } from "../utils";

const clinicName = "Vernex Multispeciality Clinic";

export default function BillingDashboard() {
  const [q, setQ] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pending, setPending] = useState<PendingPayment[]>([]);
  const [report, setReport] = useState(getRevenueReport());

  useEffect(() => {
    const load = async () => {
      try {
        const [summaries, nextReport] = await Promise.all([services.billing.getInvoices(), services.reports.getRevenueSummary()]);
        const details = await Promise.all(summaries.map((invoice) => services.billing.getInvoiceById(invoice.id)));
        const valid = details.filter(Boolean);
        setInvoices(valid.map((detail) => toInvoice(detail!, detail!.items, detail!.patient)));
        setPending(valid.filter((detail) => (detail!.balance_amount ?? 0) > 0 && detail!.invoice_status !== "cancelled").map((detail) => toPendingPayment(detail!, detail!.patient)));
        setReport(nextReport);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load billing dashboard.");
      }
    };
    void load();
  }, []);

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => `${invoice.id} ${invoice.patientName} ${invoice.phone}`.toLowerCase().includes(q.toLowerCase())).slice(0, 5), [invoices, q]);
  const stats = {
    todayRevenue: invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0),
    consultationRevenue: invoices.filter((invoice) => invoice.billType === "consultation").reduce((sum, invoice) => sum + invoice.paidAmount, 0),
    pharmacyRevenue: invoices.filter((invoice) => invoice.billType === "pharmacy").reduce((sum, invoice) => sum + invoice.paidAmount, 0),
    pendingPayments: pending.reduce((sum, payment) => sum + payment.balance, 0),
    partialPayments: invoices.filter((invoice) => invoice.paymentStatus === "partial").length,
    refunds: 0,
    billsGenerated: invoices.length,
    onlinePaymentLinks: invoices.filter((invoice) => invoice.paymentMode === "online_link").length,
  };

  return <div className="space-y-5"><PageHeader title="Billing Overview" description={`${clinicName} - Wednesday, 1 July 2026`} action={<Link to="/billing/create"><Button>Create Bill</Button></Link>} /><Input placeholder="Search by patient, phone, bill number" value={q} onChange={(e) => setQ(e.target.value)} /><BillingStatsGrid stats={stats} /><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><Card className="p-5"><h2 className="font-bold">Revenue Trend</h2><RevenueChart data={report.trend} /></Card><Card className="p-5"><h2 className="font-bold">Payment Mode Split</h2><div className="mt-4 space-y-3">{report.paymentModes.map((m) => <div key={m.mode} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><PaymentModeBadge mode={m.mode} /><b>{rupee(m.amount)}</b></div>)}</div></Card></div><Card className="p-5"><div className="mb-4 flex justify-between"><h2 className="font-bold">Recent Invoices</h2><Link className="text-sm font-bold text-brand-700" to="/billing/invoices">View all</Link></div><InvoiceTable invoices={filteredInvoices} /></Card><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Pending Payments</h2><div className="mt-4 space-y-3">{pending.map((p) => <PendingPaymentCard key={p.id} payment={p} />)}</div></Card><Card className="p-5"><h2 className="font-bold">Top Services</h2><TopServicesTable rows={report.topServices} /></Card></div></div>;
}
