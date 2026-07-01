import { dashboardSummary, familyMembers, medicineReminders, patientAppointments, patientBills, patientFollowUps, patientPrescriptions, patientProfile } from "../modules/patient-portal/mock";
import type { PatientPortalProfile } from "../modules/patient-portal/types";

export const getPatientPortalProfile = () => patientProfile;
export const getPatientAppointments = () => patientAppointments;
export const getPatientPrescriptions = () => patientPrescriptions;
export const getPatientBills = () => patientBills;
export const getPatientFollowUps = () => patientFollowUps;
export const getMedicineReminders = () => medicineReminders;
export const getFamilyMembers = () => familyMembers;
export const getPatientDashboardSummary = () => dashboardSummary;
export const updatePatientProfile = (input: Partial<PatientPortalProfile>) => ({ ...patientProfile, ...input });
export const requestFollowUpBooking = (followUpId?: string) => ({ success: true, followUpId, message: "Follow-up booking request saved as a demo placeholder." });
