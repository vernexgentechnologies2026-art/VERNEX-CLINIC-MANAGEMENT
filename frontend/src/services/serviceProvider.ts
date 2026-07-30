import { mockSupportService } from "./mock/mockSupport.service";
import { supabaseAppointmentService } from "./supabase/supabaseAppointment.service";
import { supabaseAuthService } from "./supabase/supabaseAuth.service";
import { supabaseBillingDomainService } from "./supabase/supabaseBilling.service";
import { supabaseClinicService } from "./supabase/supabaseClinic.service";
import { supabaseDoctorDomainService } from "./supabase/supabaseDoctor.service";
import { supabaseMonitoringService } from "./supabase/supabaseMonitoring.service";
import { supabasePatientService } from "./supabase/supabasePatient.service";
import { supabasePharmacyDomainService } from "./supabase/supabasePharmacy.service";
import { supabaseReportingService } from "./supabase/supabaseReporting.service";
import { supabaseUserService } from "./supabase/supabaseUser.service";
import { supabaseWhatsAppService } from "./supabase/supabaseWhatsApp.service";

export const services = {
  auth: supabaseAuthService,
  clinics: supabaseClinicService,
  users: supabaseUserService,
  appointments: supabaseAppointmentService,
  patients: supabasePatientService,
  doctor: supabaseDoctorDomainService,
  pharmacy: supabasePharmacyDomainService,
  billing: supabaseBillingDomainService,
  whatsapp: supabaseWhatsAppService,
  monitoring: supabaseMonitoringService,
  reports: supabaseReportingService,
  support: mockSupportService
};

export type Services = typeof services;
