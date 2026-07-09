import type { AppointmentRecord, AppointmentStatus } from "../../shared/types/domain";

export type AppointmentFilters = Partial<Pick<AppointmentRecord, "clinicId" | "branchId" | "doctorId" | "patientId" | "status" | "source">>;
export type CreateAppointmentInput = Omit<AppointmentRecord, "id" | "tokenNumber"> & { tokenNumber?: string };
export interface AppointmentService {
  getAppointments(filters?: AppointmentFilters): Promise<AppointmentRecord[]>;
  getAppointmentById(id: string): Promise<AppointmentRecord>;
  createAppointment(input: CreateAppointmentInput): Promise<AppointmentRecord>;
  assignDoctor(appointmentId: string, doctorId: string, slotId: string): Promise<AppointmentRecord>;
  updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<AppointmentRecord>;
}
