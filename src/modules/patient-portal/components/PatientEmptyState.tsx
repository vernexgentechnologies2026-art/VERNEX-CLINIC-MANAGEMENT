import { HeartPulse } from "lucide-react";

export function PatientEmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-2xl border border-dashed bg-white p-8 text-center"><HeartPulse className="mx-auto size-9 text-brand-500" /><h3 className="mt-3 font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></div>;
}

export function PatientErrorState() {
  return <PatientEmptyState title="Failed to load patient data" description="Please try again or contact the clinic reception if this continues." />;
}

export function PatientCardSkeleton() {
  return <div className="rounded-2xl bg-white p-4 shadow-card"><div className="h-4 w-28 animate-pulse rounded bg-slate-100" /><div className="mt-4 h-6 w-48 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" /><div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" /><div className="mt-5 grid grid-cols-2 gap-2"><div className="h-10 animate-pulse rounded-xl bg-slate-100" /><div className="h-10 animate-pulse rounded-xl bg-slate-100" /></div></div>;
}
