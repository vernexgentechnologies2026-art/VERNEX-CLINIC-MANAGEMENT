import { mockAppointmentService } from "./mock/mockAppointment.service";
import { mockAuthService } from "./mock/mockAuth.service";
import { mockBillingDomainService } from "./mock/mockBilling.service";
import { mockClinicService } from "./mock/mockClinic.service";
import { mockDoctorDomainService } from "./mock/mockDoctor.service";
import { mockPatientService } from "./mock/mockPatient.service";
import { mockPharmacyDomainService } from "./mock/mockPharmacy.service";
import { mockReportingService } from "./mock/mockReporting.service";
import { mockSupportService } from "./mock/mockSupport.service";
import { mockUserService } from "./mock/mockUser.service";
import { mockWhatsAppService } from "./mock/mockWhatsApp.service";

export const services = {
  auth: mockAuthService,
  clinics: mockClinicService,
  users: mockUserService,
  appointments: mockAppointmentService,
  patients: mockPatientService,
  doctor: mockDoctorDomainService,
  pharmacy: mockPharmacyDomainService,
  billing: mockBillingDomainService,
  whatsapp: mockWhatsAppService,
  reports: mockReportingService,
  support: mockSupportService
};

export type Services = typeof services;
