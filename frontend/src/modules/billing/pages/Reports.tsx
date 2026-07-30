import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, PageHeader } from "../../../components/ui";
import { getAppointmentReport, getDoctorPerformanceReport, getFollowUpReport, getPatientReport, getPharmacySalesReport, getRevenueReport } from "../../../services/billing.service";
import { services } from "../../../services/serviceProvider";
import { AppointmentStatusChart } from "../components/AppointmentStatusChart";
import { DoctorRevenueChart } from "../components/DoctorRevenueChart";
import { ExportActions } from "../components/ExportActions";
import { ReportFilters } from "../components/ReportFilters";
import { RevenueChart } from "../components/RevenueChart";
import { TopServicesTable } from "../components/TopServicesTable";
import type { AppointmentReport, DoctorPerformanceReport, FollowUpReport, PatientReport, PharmacySalesReport, RevenueReport } from "../types";
import { rupee } from "../utils";

const tabs = ["Revenue", "Appointments", "Doctor Performance", "Pharmacy Sales", "Patients", "Follow-ups", "Pending Payments"] as const;

export default function Reports() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Revenue");
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<RevenueReport>(getRevenueReport());
  const [appt, setAppt] = useState<AppointmentReport>(getAppointmentReport());
  const [doctors, setDoctors] = useState<DoctorPerformanceReport[]>(getDoctorPerformanceReport());
  const [pharmacy, setPharmacy] = useState<PharmacySalesReport>(getPharmacySalesReport());
  const [patients, setPatients] = useState<PatientReport>(getPatientReport());
  const [followUps] = useState<FollowUpReport>(getFollowUpReport());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [nextRevenue, nextAppointments, nextDoctors, nextPharmacy, nextPatients] = await Promise.all([
          services.reports.getRevenueSummary(),
          services.reports.getAppointmentReport(),
          services.reports.getDoctorPerformanceReport(),
          services.reports.getPharmacyReport(),
          services.reports.getPatientReport(),
        ]);
        setRevenue(nextRevenue);
        setAppt(nextAppointments);
        setDoctors(nextDoctors);
        setPharmacy(nextPharmacy);
        setPatients(nextPatients);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load reports. Showing demo fallback.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return <div className="space-y-5"><PageHeader title="Reports" description={loading ? "Loading clinic reports..." : "Clinic-specific reports for owner decisions."} action={<ExportActions />} /><ReportFilters /><div className="flex flex-wrap gap-2">{tabs.map((t) => <Button key={t} variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>{t}</Button>)}</div>{tab === "Revenue" && <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><Card className="p-5"><h2 className="font-bold">Revenue Report - {rupee(revenue.totalRevenue)}</h2><RevenueChart data={revenue.trend} /></Card><Card className="p-5"><h2 className="font-bold">Top earning services</h2><TopServicesTable rows={revenue.topServices} /></Card></div>}{tab === "Appointments" && <Card className="p-5"><h2 className="font-bold">Appointment Report</h2><AppointmentStatusChart data={[{ name: "Completed", value: appt.completed }, { name: "Cancelled", value: appt.cancelled }, { name: "No-show", value: appt.noShow }, { name: "Other", value: appt.total - appt.completed - appt.cancelled - appt.noShow }]} /><p className="text-sm text-slate-500">WhatsApp {appt.whatsapp} - QR {appt.qr} - Walk-ins {appt.walkIns} - Phone {appt.phone}</p></Card>}{tab === "Doctor Performance" && <Card className="p-5"><h2 className="font-bold">Doctor Performance</h2><DoctorRevenueChart data={doctors} /><TopServicesTable rows={doctors.map((d) => ({ service: `${d.doctorName} - ${d.averageTime} avg - ${d.prescriptions} prescriptions`, revenue: d.revenue, count: d.consultations }))} /></Card>}{tab === "Pharmacy Sales" && <Card className="p-5"><h2 className="font-bold">Pharmacy Sales - {rupee(pharmacy.revenue)}</h2><TopServicesTable rows={pharmacy.topMedicines.map((m) => ({ service: m.medicine, revenue: m.amount, count: pharmacy.billsGenerated }))} /><p className="mt-3 text-sm text-slate-500">Low-stock alerts: {pharmacy.lowStockImpact} - Expiry loss placeholder: {rupee(pharmacy.expiryLoss)}</p></Card>}{tab === "Patients" && <Card className="p-5"><h2 className="font-bold">Patient Report</h2><div className="grid gap-3 md:grid-cols-4">{Object.entries({ "New patients": patients.newPatients, "Repeat patients": patients.repeatPatients, "VIP patients": patients.vipPatients, "Follow-up patients": patients.followUpPatients }).map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-4"><b>{v}</b><p className="text-sm text-slate-500">{k}</p></div>)}</div></Card>}{tab === "Follow-ups" && <Card className="p-5"><h2 className="font-bold">Follow-up Report</h2><div className="grid gap-3 md:grid-cols-5">{Object.entries(followUps).map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-4"><b>{v}</b><p className="text-sm text-slate-500">{k}</p></div>)}</div></Card>}{tab === "Pending Payments" && <Card className="p-5"><h2 className="font-bold">Pending amount</h2><p className="text-3xl font-bold text-amber-700">{rupee(revenue.pendingAmount)}</p></Card>}</div>;
}
