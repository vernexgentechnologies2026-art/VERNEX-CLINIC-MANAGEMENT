import { mockAppointments } from "../../mocks/appointments.mock";
import { mockConfig, mockResolve } from "../../mocks/mockConfig";
import type { AppointmentRecord, AppointmentStatus } from "../../shared/types/domain";
import type { AppointmentFilters, AppointmentService, CreateAppointmentInput } from "../interfaces";

const matches = (appointment: AppointmentRecord, filters?: AppointmentFilters) => !filters || Object.entries(filters).every(([key, value]) => !value || appointment[key as keyof AppointmentRecord] === value);
export const mockAppointmentService: AppointmentService = {
  getAppointments: (filters) => mockResolve(mockConfig.useEmptyAppointments ? [] : mockAppointments.filter((appointment) => matches(appointment, filters))),
  getAppointmentById: (id) => mockResolve(mockAppointments.find((appointment) => appointment.id === id) ?? mockAppointments[0]),
  getTodayAppointments: () => mockResolve(mockAppointments),
  getDoctorAppointments: (doctorId) => mockResolve(mockAppointments.filter((appointment) => appointment.doctorId === doctorId)),
  getQueue: () => mockResolve(mockAppointments.filter((appointment) => ["arrived", "waiting", "in_consultation"].includes(appointment.status))),
  createAppointment: (input: CreateAppointmentInput) => mockResolve({ ...input, id: `apt-${Date.now()}`, tokenNumber: input.tokenNumber ?? "A999" }),
  bookAppointmentWithSlot: (input) => mockResolve({ ...mockAppointments[0], id: `apt-${Date.now()}`, slotId: String(input.slot_id ?? "") } as never),
  assignDoctor: (appointmentId, doctorId) => mockResolve({ ...(mockAppointments.find((appointment) => appointment.id === appointmentId) ?? mockAppointments[0]), doctorId }),
  updateAppointmentStatus: (id, status: AppointmentStatus) => mockResolve({ ...(mockAppointments.find((appointment) => appointment.id === id) ?? mockAppointments[0]), status }),
  cancelAppointment: (id) => mockResolve({ ...(mockAppointments.find((appointment) => appointment.id === id) ?? mockAppointments[0]), status: "cancelled" }),
  getAppointmentStatusHistory: () => mockResolve([]),
  createSlot: (input) => mockResolve({ ...input, id: `slot-${Date.now()}`, created_at: new Date().toISOString(), branch_id: input.branch_id ?? null, booked_count: input.booked_count ?? 0, capacity: input.capacity ?? 1, status: input.status ?? "available" })
};
