import { Button, Input, Modal, Select, Textarea } from "../../../components/ui";
export function StockAdjustmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title="Stock Adjustment"><div className="space-y-3"><Input placeholder="Medicine" /><Select><option>add_stock</option><option>remove_stock</option><option>damage</option><option>expired</option><option>correction</option></Select><Input type="number" placeholder="Quantity" /><Input placeholder="Reason" /><Textarea placeholder="Notes" /><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onClose}>Adjust stock</Button></div></div></Modal>;
}
