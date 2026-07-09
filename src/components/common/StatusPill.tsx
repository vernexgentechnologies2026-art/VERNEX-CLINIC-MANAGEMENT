import { statusColors } from "../../utils/statusColors";
export function StatusPill({ status }: { status: string }) { return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize leading-none ${statusColors[status] || "bg-slate-100 text-slate-600"}`}>{status.replaceAll("_", " ")}</span>; }
