import { useState } from "react";
import { Button, Input, Modal, Select, Textarea } from "../../../components/ui";
import type { Tables } from "../../../shared/types/database.types";
export function StockAdjustmentModal({ open, onClose, batches = [], onAdjust }: { open: boolean; onClose: () => void; batches?: Tables<"medicine_stock_batches">[]; onAdjust?: (input: { batchId: string; movementType: string; quantity: number; reason?: string }) => Promise<void> | void }) {
  const [batchId, setBatchId] = useState("");
  const [movementType, setMovementType] = useState("add_stock");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const submit = async () => {
    await onAdjust?.({ batchId, movementType, quantity: Number(quantity), reason });
    onClose();
  };
  return <Modal open={open} onClose={onClose} title="Stock Adjustment"><div className="space-y-3"><Select value={batchId} onChange={(event) => setBatchId(event.target.value)}><option value="">Select stock batch</option>{batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_no} - {batch.quantity_available} available</option>)}</Select><Select value={movementType} onChange={(event) => setMovementType(event.target.value)}><option>add_stock</option><option>remove_stock</option><option>damage</option><option>expired</option><option>correction</option></Select><Input type="number" placeholder="Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><Input placeholder="Reason" value={reason} onChange={(event) => setReason(event.target.value)} /><Textarea placeholder="Notes" /><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!batchId || Number(quantity) <= 0} onClick={() => void submit()}>Adjust stock</Button></div></div></Modal>;
}
