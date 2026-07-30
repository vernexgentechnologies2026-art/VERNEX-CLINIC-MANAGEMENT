import { Button, Modal } from "../../../components/ui";
import type { PatientProfile, PrescriptionItem, WhatsAppDeliveryStatus } from "../types";

export function PrescriptionWhatsAppModal({ open, patient, items, status, onClose, onSend }: { open: boolean; patient: PatientProfile; items: PrescriptionItem[]; status: WhatsAppDeliveryStatus; onClose: () => void; onSend: () => void }) {
  return <Modal open={open} onClose={onClose} title="Send prescription to WhatsApp?"><div className="space-y-3 text-sm"><p><b>Patient:</b> {patient.name}</p><p><b>WhatsApp:</b> {patient.phone}</p><p><b>Prescription date:</b> 9 Jul 2026</p><p><b>Medicine count:</b> {items.length}</p><p><b>Follow-up date:</b> 11 Jul 2026</p><p><b>Consent:</b> Patient consent confirmed</p><p className="rounded-xl bg-slate-50 p-3"><b>Delivery status:</b> {status}</p><div className="flex flex-wrap gap-2 pt-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onSend}>Send Prescription</Button></div></div></Modal>;
}
