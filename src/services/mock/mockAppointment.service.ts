import { mockAppointments } from "../../mocks/appointments.mock";
import { mockConfig, mockResolve } from "../../mocks/mockConfig";
import type { AppointmentRecord, AppointmentStatus } from "../../shared/types/domain";
import type { AppointmentFilters, AppointmentService, CreateAppointmentInput } from "../interfaces";

const matches = (appointment: AppointmentRecord, filters?: AppointmentFilters) => !filters || Object.entries(filters).every(([key, value]) => !value || appointment[key as keyof AppointmentRecord] === value);
export const mockAppointmentService: AppointmentService = {
  getAppointments: (filters) => mockResolve(mockConfig.useEmptyAppointments ? [] : mockAppointments.filter((appointment) => matches(appointment, filters))),
  getAppointmentById: (id) => mockResolve(mockAppointments.find((appointment) => appointment.id === id) ?? mockAppointments[0]),
  createAppointment: (input: CreateAppointmentInput) => mockResolve({ ...input, id: `apt-${Date.now()}`, tokenNumber: input.tokenNumber ?? "A999" }),
  assignDoctor: (appointmentId, doctorId) => mockResolve({ ...(mockAppointments.find((appointment) => appointment.id === appointmentId) ?? mockAppointments[0]), doctorId }),
  updateAppointmentStatus: (id, status: AppointmentStatus) => mockResolve({ ...(mockAppointments.find((appointment) => appointment.id === id) ?? mockAppointments[0]), status })
};
