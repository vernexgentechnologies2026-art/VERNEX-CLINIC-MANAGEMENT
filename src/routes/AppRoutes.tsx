import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LoadingSkeleton } from "../components/ui";
import PlaceholderPage from "../pages/shared/PlaceholderPage";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/auth/Login"));
const OwnerDashboard = lazy(() => import("../pages/owner/OwnerDashboard"));
const ReceptionDashboard = lazy(() => import("../modules/reception/pages/ReceptionDashboard"));
const ReceptionAppointments = lazy(() => import("../modules/reception/pages/Appointments"));
const ReceptionQueue = lazy(() => import("../modules/reception/pages/Queue"));
const ReceptionNewPatient = lazy(() => import("../modules/reception/pages/NewPatient"));
const ReceptionBilling = lazy(() => import("../modules/reception/pages/BillingShortcut"));
const DoctorQueue = lazy(() => import("../modules/doctor/pages/DoctorQueue"));
const DoctorAvailability = lazy(() => import("../modules/doctor/pages/Availability"));
const PatientReminders = lazy(() => import("../modules/doctor/pages/PatientReminders"));
const DoctorPatientProfile = lazy(() => import("../modules/doctor/pages/PatientProfile"));
const DoctorConsultation = lazy(() => import("../modules/doctor/pages/Consultation"));
const DoctorPrescription = lazy(() => import("../modules/doctor/pages/Prescription"));
const DoctorFollowUps = lazy(() => import("../modules/doctor/pages/FollowUps"));
const PharmacyDashboard = lazy(() => import("../modules/pharmacy/pages/PharmacyDashboard"));
const PharmacyPrescriptions = lazy(() => import("../modules/pharmacy/pages/PrescriptionQueue"));
const PharmacyStock = lazy(() => import("../modules/pharmacy/pages/MedicineStock"));
const PharmacyBilling = lazy(() => import("../modules/pharmacy/pages/PharmacyBilling"));
const PharmacyPurchaseEntry = lazy(() => import("../modules/pharmacy/pages/PurchaseEntry"));
const PharmacyLowStock = lazy(() => import("../modules/pharmacy/pages/LowStock"));
const PharmacyExpiryAlerts = lazy(() => import("../modules/pharmacy/pages/ExpiryAlerts"));
const BillingDashboard = lazy(() => import("../modules/billing/pages/BillingDashboard"));
const BillingCreate = lazy(() => import("../modules/billing/pages/CreateBill"));
const BillingInvoices = lazy(() => import("../modules/billing/pages/Invoices"));
const BillingReceipts = lazy(() => import("../modules/billing/pages/Receipts"));
const BillingPendingPayments = lazy(() => import("../modules/billing/pages/PendingPayments"));
const BillingRefunds = lazy(() => import("../modules/billing/pages/Refunds"));
const BillingReports = lazy(() => import("../modules/billing/pages/Reports"));
const ClinicBookingPage = lazy(() => import("../modules/patient-booking/pages/ClinicBookingPage"));
const BookingFlow = lazy(() => import("../modules/patient-booking/pages/BookingFlow"));
const AppointmentSuccess = lazy(() => import("../modules/patient-booking/pages/AppointmentSuccess"));
const BookingStatus = lazy(() => import("../modules/patient-booking/pages/BookingStatus"));
const WhatsAppBookingDashboard = lazy(() => import("../modules/whatsapp-booking/pages/WhatsAppBookingDashboard"));
const WhatsAppBookingSimulator = lazy(() => import("../modules/whatsapp-booking/pages/WhatsAppBookingSimulator"));
const WhatsAppTemplates = lazy(() => import("../modules/whatsapp-booking/pages/WhatsAppTemplates"));
const WhatsAppConversations = lazy(() => import("../modules/whatsapp-booking/pages/WhatsAppConversations"));
const WhatsAppBookingSettings = lazy(() => import("../modules/whatsapp-booking/pages/WhatsAppBookingSettings"));
const SuperAdminDashboard = lazy(() => import("../pages/super-admin/SuperAdminDashboard"));

const loading = <main className="p-5 md:p-7"><LoadingSkeleton rows={4} /></main>;

export default function AppRoutes() {
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:clinicSlug" element={<ClinicBookingPage />} />
        <Route path="/book/:clinicSlug/flow" element={<BookingFlow />} />
        <Route path="/book/:clinicSlug/success" element={<AppointmentSuccess />} />
        <Route path="/booking/status" element={<BookingStatus />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
            <Route path="/reception/appointments" element={<ReceptionAppointments />} />
            <Route path="/reception/queue" element={<ReceptionQueue />} />
            <Route path="/reception/new-patient" element={<ReceptionNewPatient />} />
            <Route path="/reception/billing" element={<ReceptionBilling />} />
            <Route path="/doctor/queue" element={<DoctorQueue />} />
            <Route path="/doctor/availability" element={<DoctorAvailability />} />
            <Route path="/doctor/patient-reminders" element={<PatientReminders />} />
            <Route path="/doctor/patient/:id" element={<DoctorPatientProfile />} />
            <Route path="/doctor/consultation/:patientId" element={<DoctorConsultation />} />
            <Route path="/doctor/prescription/:patientId" element={<DoctorPrescription />} />
            <Route path="/doctor/follow-ups" element={<DoctorFollowUps />} />
            <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
            <Route path="/pharmacy/prescriptions" element={<PharmacyPrescriptions />} />
            <Route path="/pharmacy/stock" element={<PharmacyStock />} />
            <Route path="/pharmacy/billing" element={<PharmacyBilling />} />
            <Route path="/pharmacy/purchase-entry" element={<PharmacyPurchaseEntry />} />
            <Route path="/pharmacy/low-stock" element={<PharmacyLowStock />} />
            <Route path="/pharmacy/expiry-alerts" element={<PharmacyExpiryAlerts />} />
            <Route path="/billing/dashboard" element={<BillingDashboard />} />
            <Route path="/billing/create" element={<BillingCreate />} />
            <Route path="/billing/invoices" element={<BillingInvoices />} />
            <Route path="/billing/receipts" element={<BillingReceipts />} />
            <Route path="/billing/pending-payments" element={<BillingPendingPayments />} />
            <Route path="/billing/refunds" element={<BillingRefunds />} />
            <Route path="/billing/reports" element={<BillingReports />} />
            <Route path="/whatsapp-booking/dashboard" element={<WhatsAppBookingDashboard />} />
            <Route path="/whatsapp-booking/simulator" element={<WhatsAppBookingSimulator />} />
            <Route path="/whatsapp-booking/templates" element={<WhatsAppTemplates />} />
            <Route path="/whatsapp-booking/conversations" element={<WhatsAppConversations />} />
            <Route path="/whatsapp-booking/settings" element={<WhatsAppBookingSettings />} />
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/owner/*" element={<PlaceholderPage />} />
            <Route path="/reception/*" element={<PlaceholderPage />} />
            <Route path="/doctor/*" element={<PlaceholderPage />} />
            <Route path="/pharmacy/*" element={<PlaceholderPage />} />
            <Route path="/super-admin/*" element={<PlaceholderPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
