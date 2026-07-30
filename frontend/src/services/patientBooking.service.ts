import { availableDates, availableSlots, bookingDoctors, bookingServices, clinicProfile, mockBookingStatus } from "../modules/patient-booking/mock";
import type { BookingSummary, PatientBookingInput } from "../modules/patient-booking/types";

export const getClinicBookingProfile = () => clinicProfile;
export const getDoctors = () => bookingDoctors;
export const getServices = () => bookingServices;
export const getAvailableDates = () => availableDates;
export const getAvailableSlots = () => availableSlots;
export const createBooking = (input: Partial<BookingSummary> & { patient?: PatientBookingInput }) => ({ ...input, bookingId: "VNX-48219", token: "A014", status: "confirmed" as const });
export const getBookingStatus = () => mockBookingStatus;
