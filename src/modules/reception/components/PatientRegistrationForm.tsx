import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Select, Textarea } from "../../../components/ui";
import { doctors } from "../mock";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(["female", "male", "other"]),
  emergencyContactPhone: z.string().optional()
});

type FormValues = z.infer<typeof schema>;
const tags = ["New Patient", "Regular Patient", "Senior Citizen", "Child", "Diabetes", "BP", "Pregnancy", "Follow-up Required", "VIP"];

export function PatientRegistrationForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "female" } });
  return <form onSubmit={handleSubmit(() => undefined)} className="space-y-5"><Section title="Basic Details"><Field label="Full name" error={errors.fullName?.message}><Input {...register("fullName")} placeholder="e.g. Kavya Reddy" /></Field><Field label="Phone number" error={errors.phone?.message}><Input {...register("phone")} placeholder="+91 98765 43210" /></Field><Field label="Age" error={errors.age?.message}><Input {...register("age")} type="number" /></Field><Field label="Gender" error={errors.gender?.message}><Select {...register("gender")}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></Select></Field><Input placeholder="Date of birth optional" type="date" /><Input placeholder="Blood group optional" /></Section><Section title="Contact Details"><Input placeholder="Address" /><Input placeholder="City" /><Input placeholder="Emergency contact name" /><Input {...register("emergencyContactPhone")} placeholder="Emergency contact phone" /></Section><Section title="Medical Details"><Textarea placeholder="Allergies" /><Textarea placeholder="Existing conditions" /><Textarea placeholder="Current medications" /><Textarea placeholder="Medical history notes" /></Section><Section title="Visit Details"><Input placeholder="Reason for visit" /><Select>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</Select><Select><option>walk_in</option><option>phone_call</option><option>qr_booking</option><option>whatsapp</option><option>website</option></Select><Textarea placeholder="Notes" /></Section><div className="card p-5"><h2 className="font-bold">Tags</h2><div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <label key={tag} className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:bg-brand-50"><input type="checkbox" className="mr-2" />{tag}</label>)}</div></div><div className="flex flex-wrap gap-3"><Button type="submit">Save Patient</Button><Button type="button" variant="secondary">Save & Create Appointment</Button><Button type="button" variant="ghost" onClick={() => reset()}>Reset</Button></div></form>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-5"><h2 className="mb-4 font-bold">{title}</h2><div className="grid gap-4 md:grid-cols-2">{children}</div></section>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="text-xs font-bold text-slate-600">{label}{children}{error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}</label>;
}
