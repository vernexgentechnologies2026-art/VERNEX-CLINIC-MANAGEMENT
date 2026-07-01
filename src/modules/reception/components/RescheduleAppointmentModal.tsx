import { Button, Input, Modal, Select, Textarea } from "../../../components/ui";
import { timeSlots } from "../mock";

export function RescheduleAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title="Reschedule Appointment"><div className="space-y-4"><label className="text-xs font-bold">New date<Input className="mt-1" type="date" /></label><label className="text-xs font-bold">New time slot<Select className="mt-1">{timeSlots.map((slot) => <option key={slot.id}>{slot.label}</option>)}</Select></label><label className="text-xs font-bold">Reason<Textarea className="mt-1" placeholder="Why is this being rescheduled?" /></label><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onClose}>Save</Button></div></div></Modal>;
}
