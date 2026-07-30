import { Input } from "../../../components/ui";
export function MedicineSearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Medicine name e.g. Paracetamol 500mg" />;
}
