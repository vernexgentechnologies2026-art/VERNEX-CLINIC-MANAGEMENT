import type { PatientRecord } from "../../shared/types/domain";

export interface PatientService {
  getPatients(clinicId?: string): Promise<PatientRecord[]>;
  getPatientById(id: string): Promise<PatientRecord>;
  findByWhatsAppNumber(number: string): Promise<PatientRecord | null>;
  createPatient(input: Omit<PatientRecord, "id" | "patientId">): Promise<PatientRecord>;
}
