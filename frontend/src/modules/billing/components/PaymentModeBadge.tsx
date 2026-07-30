import type { PaymentMode } from "../types";
import { paymentModeLabel } from "../utils";
export function PaymentModeBadge({ mode }: { mode: PaymentMode }) { return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{paymentModeLabel[mode]}</span>; }
