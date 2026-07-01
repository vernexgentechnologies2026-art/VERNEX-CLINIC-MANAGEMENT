import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Textarea } from "../../../components/ui";

const schema = z.object({ supplierName: z.string().min(2), invoiceNumber: z.string().min(1), purchaseDate: z.string().min(1) });
export function PurchaseEntryForm() {
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });
  return <form onSubmit={handleSubmit(() => undefined)} className="card p-5"><h2 className="font-bold">Stock Purchase Entry</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><Input {...register("supplierName")} placeholder="Supplier name" /><Input {...register("invoiceNumber")} placeholder="Purchase invoice number" /><Input {...register("purchaseDate")} type="date" /></div><div className="mt-4 grid gap-3 rounded-xl border p-3 md:grid-cols-4"><Input placeholder="Medicine" /><Input placeholder="Batch number" /><Input type="date" /><Input type="number" placeholder="Quantity purchased" /><Input type="number" placeholder="Purchase price" /><Input type="number" placeholder="Selling price" /><Input type="number" placeholder="MRP" /><Input type="number" placeholder="Total cost" /></div><Textarea className="mt-3" placeholder="Notes" /><div className="mt-4 flex gap-2"><Button>Add medicine row</Button><Button type="submit">Save purchase entry</Button><Button type="button" variant="ghost" onClick={() => reset()}>Reset</Button></div></form>;
}
