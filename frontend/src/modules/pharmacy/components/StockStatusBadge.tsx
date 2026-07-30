import type { PaymentStatus, PrescriptionStatus, StockStatus } from "../types";
import { paymentLabel, rxStatusLabel, stockLabel } from "../utils";

const stockTone: Record<StockStatus, string> = { in_stock: "bg-emerald-50 text-emerald-700", low_stock: "bg-amber-50 text-amber-700", out_of_stock: "bg-rose-50 text-rose-700", expired: "bg-red-100 text-red-800", expiring_soon: "bg-orange-50 text-orange-700" };
export function StockStatusBadge({ status }: { status: StockStatus }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stockTone[status]}`}>{stockLabel[status]}</span>; }
export function PrescriptionStatusBadge({ status }: { status: PrescriptionStatus }) { const tone = status === "pending" ? "bg-amber-50 text-amber-700" : status === "dispensed" ? "bg-emerald-50 text-emerald-700" : status === "cancelled" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"; return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{rxStatusLabel[status]}</span>; }
export function PharmacyPaymentBadge({ status }: { status: PaymentStatus }) { const tone = status === "paid" ? "bg-emerald-50 text-emerald-700" : status === "pending" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"; return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{paymentLabel[status]}</span>; }
