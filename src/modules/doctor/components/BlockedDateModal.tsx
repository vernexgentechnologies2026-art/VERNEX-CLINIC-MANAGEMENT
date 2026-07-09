import { Button, Input, Modal } from "../../../components/ui";

export function BlockedDateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title="Block doctor date"><div className="space-y-3"><Input type="date" defaultValue="2026-07-16" /><Input placeholder="Reason" defaultValue="Conference" /><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" /> Emergency leave</label><Button onClick={onClose}>Save block</Button></div></Modal>;
}
