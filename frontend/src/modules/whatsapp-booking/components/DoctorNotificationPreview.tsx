import { Bell } from "lucide-react";
import { Card } from "../../../components/ui";
import { departmentLabel } from "../utils";
import type { WhatsAppConfirmedAppointment } from "../types";

export function DoctorNotificationPreview({ appointment }: { appointment: WhatsAppConfirmedAppointment }) {
  return <Card className="border-brand-200 bg-brand-50 p-4"><div className="flex gap-3"><Bell className="size-5 text-brand-700" /><div><p className="font-bold">New WhatsApp Appointment</p><p className="text-sm text-brand-800">{appointment.patientName} - {departmentLabel(appointment.department)} - {appointment.appointmentTime}</p><p className="mt-1 text-xs text-brand-700">{appointment.mainProblem}</p></div></div></Card>;
}
