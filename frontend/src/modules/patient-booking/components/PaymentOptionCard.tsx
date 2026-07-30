import type { PaymentOption } from "../types";
import { paymentLabel } from "../utils";
export function PaymentOptionCard({ option, selected, onSelect }: { option: PaymentOption; selected: boolean; onSelect: () => void }) { return <button onClick={onSelect} className={`rounded-2xl border p-4 text-left ${selected ? "border-brand-500 bg-brand-50" : "bg-white"}`}><b>{paymentLabel[option]}</b><p className="mt-1 text-sm text-slate-500">{option === "pay_at_clinic" ? "No payment required now." : "Online payment placeholder only."}</p></button>; }
