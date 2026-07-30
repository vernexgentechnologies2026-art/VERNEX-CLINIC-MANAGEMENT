import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Textarea } from "../../../components/ui";

const schema = z.object({ supplierName: z.string().min(2), invoiceNumber: z.string().min(1), purchaseDate: z.string().min(1), medicineName: z.string().min(2), batchNumber: z.string().min(1), expiryDate: z.string().min(1), quantity: z.coerce.number().min(1), purchasePrice: z.coerce.number().min(0), sellingPrice: z.coerce.number().min(0), mrp: z.coerce.number().min(0).optional(), notes: z.string().optional() });
type PurchaseEntryInput = z.infer<typeof schema>;
export function PurchaseEntryForm({ onSave }: { onSave?: (input: PurchaseEntryInput) => Promise<void> | void }) {
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });
  return <form onSubmit={handleSubmit(async (input) => { await onSave?.(input); reset(); })} className="card p-5"><h2 className="font-bold">Stock Purchase Entry</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><Input {...register("supplierName")} placeholder="Supplier name" /><Input {...register("invoiceNumber")} placeholder="Purchase invoice number" /><Input {...register("purchaseDate")} type="date" /></div><div className="mt-4 grid gap-3 rounded-xl border p-3 md:grid-cols-4"><Input {...register("medicineName")} placeholder="Medicine" /><Input {...register("batchNumber")} placeholder="Batch number" /><Input {...register("expiryDate")} type="date" /><Input {...register("quantity")} type="number" placeholder="Quantity purchased" /><Input {...register("purchasePrice")} type="number" placeholder="Purchase price" /><Input {...register("sellingPrice")} type="number" placeholder="Selling price" /><Input {...register("mrp")} type="number" placeholder="MRP" /><Input type="number" placeholder="Total cost" /></div><Textarea {...register("notes")} className="mt-3" placeholder="Notes" /><div className="mt-4 flex gap-2"><Button>Add medicine row</Button><Button type="submit">Save purchase entry</Button><Button type="button" variant="ghost" onClick={() => reset()}>Reset</Button></div></form>;
}
