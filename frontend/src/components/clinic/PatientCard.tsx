import type { Patient } from "../../types/patient";
import { Card } from "../common/Card";
export function PatientCard({ patient }: { patient: Patient }) { return <Card className="p-4"><p className="font-semibold">{patient.name}</p><p className="text-sm text-slate-500">{patient.age} yrs · {patient.gender} · {patient.phone}</p></Card>; }
