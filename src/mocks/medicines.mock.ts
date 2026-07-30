import type { MedicineRecord } from "../shared/types/domain";

export const mockMedicines: MedicineRecord[] = [
  { id: "med-paracetamol", name: "Paracetamol 500mg", category: "Analgesic", form: "Tablet", manufacturer: "Cipla" },
  { id: "med-ors", name: "ORS Sachet", category: "Hydration", form: "Sachet", manufacturer: "FDC" },
  { id: "med-cetirizine", name: "Cetirizine 10mg", category: "Antihistamine", form: "Tablet", manufacturer: "Sun Pharma" },
  { id: "med-telmisartan", name: "Telmisartan 40mg", category: "Antihypertensive", form: "Tablet", manufacturer: "Glenmark" }
];
