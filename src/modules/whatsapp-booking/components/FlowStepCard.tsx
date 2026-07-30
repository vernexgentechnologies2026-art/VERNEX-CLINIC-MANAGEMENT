import type { WhatsAppFlowStep } from "../types";

export function FlowStepCard({ step, index }: { step: WhatsAppFlowStep; index: number }) {
  return <div className="rounded-2xl border bg-white p-4"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700">{index + 1}</span><div><h3 className="font-bold">{step.title}</h3><p className="mt-1 text-sm text-slate-500">{step.description}</p><p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">{step.sampleMessage}</p></div></div></div>;
}
