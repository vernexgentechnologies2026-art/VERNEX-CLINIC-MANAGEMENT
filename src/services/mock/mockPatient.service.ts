import { mockResolve } from "../../mocks/mockConfig";
import { mockPatients } from "../../mocks/patients.mock";
import type { PatientRecord } from "../../shared/types/domain";
import type { PatientService } from "../interfaces";

export const mockPatientService: PatientService = {
  getPatients: (clinicId) => mockResolve(clinicId ? mockPatients.filter((patient) => patient.clinicId === clinicId) : mockPatients),
  getPatientById: (id) => mockResolve(mockPatients.find((patient) => patient.id === id) ?? mockPatients[0]),
  findByWhatsAppNumber: (number) => mockResolve(mockPatients.find((patient) => patient.whatsappNumber === number) ?? null),
  createPatient: (input: Omit<PatientRecord, "id" | "patientId">) => mockResolve({ ...input, id: `patient-${Date.now()}`, patientId: `P-${Date.now()}` })
};
