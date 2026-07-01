import { appointments, pendingBills, queueItems, receptionStats } from "../modules/reception/mock";
import type { Appointment, AppointmentStatus, PatientRegistrationInput } from "../modules/reception/types";

export function getReceptionStats() {
  return receptionStats;
}

export function getAppointments() {
  return appointments;
}

export function getQueueItems() {
  return queueItems;
}

export function createAppointment(input: Partial<Appointment>) {
  return { ...appointments[0], ...input, id: `a${appointments.length + 1}`, token: `A0${appointments.length + 10}` };
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  return appointments.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment));
}

export function registerPatient(input: PatientRegistrationInput) {
  return { id: `P-${Math.floor(2000 + Math.random() * 8000)}`, ...input };
}

export function getPendingBills() {
  return pendingBills;
}
