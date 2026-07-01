import { Link } from "react-router-dom";
import { Button, Card } from "../../../components/ui";
import { getMedicineReminders, getPatientAppointments, getPatientBills, getPatientDashboardSummary, getPatientPortalProfile, getPatientPrescriptions } from "../../../services/patientPortal.service";
import { BillCard } from "../components/BillCard";
import { MedicineReminderCard } from "../components/MedicineReminderCard";
import { PatientPortalHeader } from "../components/PatientPortalHeader";
import { PatientQuickActions } from "../components/PatientQuickActions";
import { PatientStatsGrid } from "../components/PatientStatsGrid";
import { PrescriptionCard } from "../components/PrescriptionCard";
import { UpcomingAppointmentCard } from "../components/UpcomingAppointmentCard";

export default function PatientDashboard() {
  const profile = getPatientPortalProfile();
  const nextAppointment = getPatientAppointments().find((item) => ["booked", "confirmed", "arrived"].includes(item.status));
  const reminders = getMedicineReminders().slice(0, 2);
  const recentPrescription = getPatientPrescriptions()[0];
  const pendingBill = getPatientBills().find((bill) => bill.status !== "paid");
  return <div className="mx-auto max-w-5xl space-y-5 pb-20 lg:pb-0"><PatientPortalHeader name={profile.name} /><PatientStatsGrid summary={getPatientDashboardSummary()} /><PatientQuickActions />{nextAppointment && <UpcomingAppointmentCard appointment={nextAppointment} />}<div className="grid gap-5 lg:grid-cols-2"><Card className="p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Today's Medicine Reminders</h2><Link to="/patient/medicine-reminders" className="text-sm font-bold text-brand-700">View all</Link></div><div className="space-y-3">{reminders.map((reminder) => <MedicineReminderCard key={reminder.id} reminder={reminder} />)}</div></Card><Card className="p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Recent Prescription</h2><Link to="/patient/prescriptions" className="text-sm font-bold text-brand-700">View all</Link></div><PrescriptionCard prescription={recentPrescription} onView={() => undefined} /></Card></div>{pendingBill && <div><h2 className="mb-3 font-bold">Pending Bill</h2><BillCard bill={pendingBill} onView={() => undefined} /></div>}<div className="flex justify-center"><Link to="/book/vernex-clinic"><Button variant="secondary">Book a new appointment</Button></Link></div></div>;
}
