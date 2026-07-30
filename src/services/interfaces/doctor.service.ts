import type { ConsultationRecord, DoctorAvailabilityRecord, PrescriptionRecord, ReminderRecord } from "../../shared/types/domain";

export interface DoctorDomainService {
  getDoctorAvailability(doctorId: string): Promise<DoctorAvailabilityRecord[]>;
  getConsultations(patientId?: string): Promise<ConsultationRecord[]>;
  getPrescriptions(patientId?: string): Promise<PrescriptionRecord[]>;
  sendPrescriptionToWhatsApp(prescriptionId: string): Promise<PrescriptionRecord>;
  getReminders(patientId?: string): Promise<ReminderRecord[]>;
}
