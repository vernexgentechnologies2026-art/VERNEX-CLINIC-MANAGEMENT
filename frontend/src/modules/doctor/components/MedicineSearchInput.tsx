import { useEffect, useId, useState } from "react";
import { Input } from "../../../components/ui";
import { services } from "../../../services/serviceProvider";

let cachedNames: Promise<string[]> | null = null;

/**
 * Suggests medicines from the clinic's own catalogue. The list is fetched once
 * per session because a prescription renders one of these per medicine row.
 */
function loadMedicineNames() {
  if (!cachedNames) {
    cachedNames = services.pharmacy
      .getMedicines({ status: "active" })
      .then((medicines) => Array.from(new Set(medicines.map((medicine) => medicine.name))))
      .catch(() => []);
  }
  return cachedNames;
}

export function MedicineSearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const listId = useId();
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    void loadMedicineNames().then((next) => { if (mounted) setNames(next); });
    return () => { mounted = false; };
  }, []);

  return <>
    <Input list={listId} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Medicine name e.g. Paracetamol 500mg" />
    <datalist id={listId}>{names.map((name) => <option key={name} value={name} />)}</datalist>
  </>;
}
