import type { LucideIcon } from "lucide-react";
export function StatsCard({ label, value, detail, icon: Icon, tone = "teal" }: { label: string; value: string; detail?: string; icon: LucideIcon; tone?: "teal" | "blue" | "amber" | "violet" }) {
  const colors = { teal: "bg-brand-50 text-brand-700", blue: "bg-blue-50 text-blue-700", amber: "bg-amber-50 text-amber-700", violet: "bg-violet-50 text-violet-700" };
  return <div className="card p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div><span className={`rounded-xl p-2.5 ${colors[tone]}`}><Icon className="size-5" /></span></div></div>;
}
