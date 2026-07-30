import { mockResolve } from "../../mocks/mockConfig";
import { mockPatients } from "../../mocks/patients.mock";
import type { PatientRecord } from "../../shared/types/domain";
import type { PatientService } from "../interfaces";

export const mockPatientService: PatientService = {
  getPatients: (filters) => {
    const clinicId = typeof filters === "string" ? filters : filters?.clinicId;
    return mockResolve(clinicId ? mockPatients.filter((patient) => patient.clinicId === clinicId) : mockPatients);
  },
  getPatientById: (id) => mockResolve(mockPatients.find((patient) => patient.id === id) ?? mockPatients[0]),
  searchPatients: (query) => mockResolve(mockPatients.filter((patient) => `${patient.fullName} ${patient.phone} ${patient.whatsappNumber}`.toLowerCase().includes(query.toLowerCase()))),
  findPatientByPhone: (phone) => mockResolve(mockPatients.find((patient) => patient.phone === phone) ?? null),
  findByWhatsAppNumber: (number) => mockResolve(mockPatients.find((patient) => patient.whatsappNumber === number) ?? null),
  findPatientByWhatsAppNumber: (number) => mockResolve(mockPatients.find((patient) => patient.whatsappNumber === number) ?? null),
  createPatient: (input: Omit<PatientRecord, "id" | "patientId">) => mockResolve({ ...input, id: `patient-${Date.now()}`, patientId: `P-${Date.now()}` }),
  updatePatient: (id, input) => mockResolve({ ...(mockPatients.find((patient) => patient.id === id) ?? mockPatients[0]), fullName: input.full_name ?? (mockPatients.find((patient) => patient.id === id) ?? mockPatients[0]).fullName }),
  archivePatient: (id) => mockResolve(mockPatients.find((patient) => patient.id === id) ?? mockPatients[0]),
  getPatientFamilyMembers: () => mockResolve([]),
  linkFamilyMember: (input) => mockResolve({ ...input, id: `family-${Date.now()}`, created_at: new Date().toISOString(), relationship: input.relationship ?? null }),
  getPatientNotes: () => mockResolve([]),
  addPatientNote: (input) => mockResolve({ ...input, id: `note-${Date.now()}`, created_at: new Date().toISOString(), created_by: input.created_by ?? null, visibility: input.visibility ?? "internal" })
};
