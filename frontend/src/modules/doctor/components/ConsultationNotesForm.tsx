import { Textarea } from "../../../components/ui";
export function ConsultationNotesForm() {
  return <section className="card p-5"><h2 className="font-bold">Clinical Notes</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><Textarea placeholder="Examination notes" /><Textarea placeholder="Advice" /><Textarea placeholder="Lifestyle advice" /><Textarea placeholder="Procedure suggestion" /></div></section>;
}
