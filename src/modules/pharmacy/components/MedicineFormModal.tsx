import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, Select, Textarea } from "../../../components/ui";

const schema = z.object({ name: z.string().min(2), category: z.string().min(1), batchNumber: z.string().min(1), expiryDate: z.string().min(1), currentStock: z.coerce.number().min(0), sellingPrice: z.coerce.number().min(0) });
export function MedicineFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  return <Modal open={open} onClose={onClose} title="Add / Edit Medicine"><form onSubmit={handleSubmit(() => onClose())} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"><div className="grid gap-3 sm:grid-cols-2"><Input {...register("name")} placeholder="Medicine name" /><Input placeholder="Generic name" /><Select {...register("category")}><option value="general">General</option><option value="antibiotic">Antibiotic</option><option value="dental">Dental</option><option value="skin">Skin</option><option value="pediatric">Pediatric</option><option value="physiotherapy">Physiotherapy</option></Select><Input {...register("batchNumber")} placeholder="Batch number" /><Input {...register("expiryDate")} type="date" /><Input {...register("currentStock")} type="number" placeholder="Current stock" /><Input type="number" placeholder="Reorder level" /><Input type="number" placeholder="Purchase price" /><Input {...register("sellingPrice")} type="number" placeholder="Selling price" /><Input type="number" placeholder="MRP" /><Input placeholder="Supplier" /><Input type="number" placeholder="GST % optional" /></div><Textarea placeholder="Notes" /><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save medicine</Button></div></form></Modal>;
}
