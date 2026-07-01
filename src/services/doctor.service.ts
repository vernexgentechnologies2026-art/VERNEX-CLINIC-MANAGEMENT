import { doctorQueue, doctorStats, favoriteMedicines, followUps, labTests, patientProfiles, prescriptions, prescriptionTemplates, timeline } from "../modules/doctor/mock";
import type { ConsultationFormInput, Prescription } from "../modules/doctor/types";

export const getDoctorStats = () => doctorStats;
export const getDoctorQueue = () => doctorQueue;
export const getPatientProfile = (id = "p1") => patientProfiles.find((p) => p.id === id) ?? patientProfiles[0];
export const getPatientTimeline = () => timeline;
export const getConsultationById = (id: string) => ({ id, patientId: "p1", draft: true });
export const saveConsultationDraft = (input: ConsultationFormInput) => ({ id: "draft-1", ...input });
export const completeConsultation = (id: string) => ({ id, status: "completed" as const });
export const getPrescriptionTemplates = () => prescriptionTemplates;
export const getFavoriteMedicines = () => favoriteMedicines;
export const createPrescription = (input: Partial<Prescription>) => ({ ...prescriptions[0], ...input, id: `rx-${Date.now()}` });
export const scheduleFollowUp = (input: unknown) => ({ id: `fu-${Date.now()}`, input });
export const getLabTests = () => labTests;
export const getFollowUps = () => followUps;
export const getPastPrescriptions = () => prescriptions;
