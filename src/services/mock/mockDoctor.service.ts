import { mockConsultations } from "../../mocks/consultations.mock";
import { mockDoctorAvailability } from "../../mocks/doctorAvailability.mock";
import { mockResolve } from "../../mocks/mockConfig";
import { mockPrescriptions } from "../../mocks/prescriptions.mock";
import { mockReminders } from "../../mocks/reminders.mock";
import type { DoctorDomainService } from "../interfaces";

export const mockDoctorDomainService: DoctorDomainService = {
  getDoctorAvailability: (doctorId) => mockResolve(mockDoctorAvailability.filter((item) => item.doctorId === doctorId)),
  getConsultations: (patientId) => mockResolve(patientId ? mockConsultations.filter((item) => item.patientId === patientId) : mockConsultations),
  getPrescriptions: (patientId) => mockResolve(patientId ? mockPrescriptions.filter((item) => item.patientId === patientId) : mockPrescriptions),
  sendPrescriptionToWhatsApp: (prescriptionId) => mockResolve({ ...(mockPrescriptions.find((item) => item.id === prescriptionId) ?? mockPrescriptions[0]), status: "sent_to_whatsapp", deliveryStatus: "queued" }),
  getReminders: (patientId) => mockResolve(patientId ? mockReminders.filter((item) => item.patientId === patientId) : mockReminders)
};
