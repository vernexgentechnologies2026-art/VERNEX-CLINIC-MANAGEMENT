import { Button, Modal, Textarea } from "../../../components/ui";

export function CancelAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title="Cancel Appointment"><div className="space-y-4"><label className="text-xs font-bold">Cancellation reason<Textarea className="mt-1" placeholder="Patient requested cancellation, doctor unavailable..." /></label><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" /> Send WhatsApp cancellation placeholder</label><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Keep appointment</Button><Button variant="danger" onClick={onClose}>Confirm cancel</Button></div></div></Modal>;
}
