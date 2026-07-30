import { Button } from "../../../components/ui";
import type { Refund } from "../types";
import { rupee } from "../utils";
import { RefundStatusBadge } from "./PaymentStatusBadge";
export function RefundRequestCard({ refund }: { refund: Refund }) { return <div className="card p-4"><div className="flex justify-between gap-3"><div><b>{refund.id}</b><h3 className="font-bold">{refund.patientName}</h3><p className="text-sm text-slate-500">{refund.invoiceNumber} · {refund.reason}</p></div><RefundStatusBadge status={refund.status} /></div><p className="mt-3 text-sm">Original {rupee(refund.originalAmount)} · Refund <b>{rupee(refund.refundAmount)}</b> · {refund.date}</p><div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary">View details</Button><Button>Approve</Button><Button variant="ghost">Reject</Button><Button variant="ghost">Mark processed</Button></div></div>; }
