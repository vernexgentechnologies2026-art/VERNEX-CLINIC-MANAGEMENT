import { formatCurrency } from "../../utils/formatCurrency";
export function BillingSummary({ total, pending }: { total: number; pending: number }) { return <div className="card grid grid-cols-2 gap-4 p-4"><div><p className="text-xs text-slate-500">Total</p><b>{formatCurrency(total)}</b></div><div><p className="text-xs text-slate-500">Pending</p><b>{formatCurrency(pending)}</b></div></div>; }
