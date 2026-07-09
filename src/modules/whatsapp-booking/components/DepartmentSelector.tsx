import { Card } from "../../../components/ui";
import { departmentLabel, departments } from "../mock";
import type { ClinicDepartment } from "../types";

export function DepartmentSelector({ selected }: { selected?: ClinicDepartment }) {
  return <Card className="p-4"><p className="font-bold">Department options</p><div className="mt-3 flex flex-wrap gap-2">{departments.map((department) => <span key={department} className={`rounded-full px-3 py-1 text-xs font-bold ${department === selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>{departmentLabel[department]}</span>)}</div></Card>;
}
