import { PageHeader } from "../../../components/ui";
import { getWhatsAppSettings } from "../../../services/whatsappBooking.service";
import { WhatsAppSettingsForm } from "../components/WhatsAppSettingsForm";
import { WhatsAppStatusBadge } from "../components/WhatsAppStatusBadge";

export default function WhatsAppBookingSettings() {
  return <div className="space-y-5"><PageHeader title="WhatsApp Booking Settings" description="Future official WhatsApp API integration settings. Demo-only today." action={<WhatsAppStatusBadge status="demo" />} /><WhatsAppSettingsForm settings={getWhatsAppSettings()} /></div>;
}
