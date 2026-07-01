import { Button, Card } from "../../../components/ui";
import type { PatientBill } from "../types";
import { formatInr, labelFromValue } from "../utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

export function BillCard({ bill, onView }: { bill: PatientBill; onView: (bill: PatientBill) => void }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{bill.billNumber}</h3><p className="text-sm text-slate-500">{labelFromValue(bill.billType)} • {bill.date}</p><p className="mt-2 text-xl font-bold">{formatInr(bill.totalAmount)}</p><p className="text-xs text-slate-500">Paid {formatInr(bill.paidAmount)} • Balance {formatInr(bill.balance)}</p></div><PatientStatusBadge status={bill.status} /></div><div className="mt-4 grid gap-2 sm:grid-cols-4"><Button onClick={() => onView(bill)}>View receipt</Button><Button variant="secondary">Pay online</Button><Button variant="secondary">Download receipt</Button><Button variant="ghost">Contact reception</Button></div></Card>;
}
