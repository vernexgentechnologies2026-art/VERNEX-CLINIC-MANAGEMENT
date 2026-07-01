import { CalendarPlus, FileHeart, Phone, ReceiptIndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

export function PatientQuickActions() {
  const actions = [
    { label: "Appointments", path: "/patient/appointments", icon: CalendarPlus },
    { label: "Prescriptions", path: "/patient/prescriptions", icon: FileHeart },
    { label: "Bills", path: "/patient/bills", icon: ReceiptIndianRupee },
    { label: "Contact Clinic", path: "/patient/profile", icon: Phone }
  ];
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{actions.map(({ label, path, icon: Icon }) => <Link key={label} to={path} className="rounded-2xl bg-white p-4 text-center text-sm font-bold shadow-card transition hover:-translate-y-0.5"><Icon className="mx-auto mb-2 size-5 text-brand-600" />{label}</Link>)}</div>;
}
