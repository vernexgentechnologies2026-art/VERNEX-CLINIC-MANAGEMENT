import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { Button, Textarea } from "../../../components/ui";
import { getFavoriteMedicines, getLabTests, getPrescriptionTemplates } from "../../../services/doctor.service";
import type { PatientProfile, PrescriptionItem } from "../types";
import { LabTestSuggestionPanel } from "./LabTestSuggestionPanel";
import { MedicineRow } from "./MedicineRow";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { PrescriptionTemplatePanel } from "./PrescriptionTemplatePanel";

const blank = (): PrescriptionItem => ({ id: crypto.randomUUID(), medicineName: "", dosage: "1 tablet", frequency: "1-0-1", timing: "After food", duration: "3 days", instructions: "", quantity: "" });
export function PrescriptionBuilder({ patient }: { patient: PatientProfile }) {
  const [items, setItems] = useState<PrescriptionItem[]>([{ ...blank(), medicineName: "Paracetamol 500mg" }]);
  const update = (next: PrescriptionItem) => setItems((rows) => rows.map((row) => row.id === next.id ? next : row));
  const addItems = (newItems: PrescriptionItem[]) => setItems((rows) => [...rows, ...newItems.map((i) => ({ ...i, id: crypto.randomUUID() }))]);
  return <div className="space-y-5"><div className="card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Medicine Builder</h2><div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" icon={<Plus className="size-4" />} onClick={() => setItems([...items, blank()])}>Add Medicine</Button><Button type="button" variant="ghost" onClick={() => setItems([])}>Clear Prescription</Button></div></div><div className="mt-4 space-y-3">{items.map((item) => <MedicineRow key={item.id} item={item} onChange={update} onRemove={() => setItems(items.filter((row) => row.id !== item.id))} />)}</div></div><div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]"><div className="space-y-5"><div className="card p-5"><h2 className="font-bold">Favorite Medicines</h2><div className="mt-3 flex flex-wrap gap-2">{getFavoriteMedicines().map((m) => <Button key={m.id} variant="secondary" className="min-h-8 px-3 py-1" onClick={() => addItems([{ ...blank(), medicineName: m.name }])}>{m.name}</Button>)}</div></div><PrescriptionTemplatePanel templates={getPrescriptionTemplates()} onUse={addItems} /><LabTestSuggestionPanel tests={getLabTests()} /></div><div className="space-y-5"><div className="card p-5"><h2 className="font-bold">Advice</h2><div className="mt-3 grid gap-3 md:grid-cols-2"><Textarea placeholder="General advice" /><Textarea placeholder="Diet advice" /><Textarea placeholder="Avoid items" /><Textarea placeholder="Rest/work note" /></div></div><PrescriptionPreview patient={patient} items={items} /></div></div><div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-2xl border bg-white/95 p-3 shadow-card backdrop-blur"><Button>Save Prescription</Button><Button variant="secondary" icon={<Send className="size-4" />}>Send to WhatsApp</Button><Button variant="secondary">Print Prescription</Button><Button variant="secondary">Send to Pharmacy</Button><Button>Complete Consultation</Button></div></div>;
}
