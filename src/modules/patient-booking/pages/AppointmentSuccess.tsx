import { getBookingStatus, getClinicBookingProfile } from "../../../services/patientBooking.service";
import { AppointmentSuccessCard } from "../components/AppointmentSuccessCard";
export default function AppointmentSuccess() { return <main className="grid min-h-screen place-items-center bg-brand-50 p-5"><AppointmentSuccessCard result={getBookingStatus()} clinic={getClinicBookingProfile()} /></main>; }
