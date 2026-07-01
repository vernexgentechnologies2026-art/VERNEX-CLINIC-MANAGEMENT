import { BrandLogo, Modal } from "../../../components/ui";
import type { PatientBill } from "../types";
import { formatInr, labelFromValue } from "../utils";

export function ReceiptDetailModal({ bill, onClose, patientName }: { bill: PatientBill | null; onClose: () => void; patientName: string }) {
  return <Modal open={!!bill} onClose={onClose} title="Receipt">{bill && <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1 text-sm"><div className="flex items-center gap-3"><BrandLogo className="size-12" /><div><h3 className="font-bold">Vernex Multispeciality Clinic</h3><p className="text-slate-500">{bill.receiptNumber}</p></div></div><p><b>Patient:</b> {patientName}</p><div className="space-y-2">{bill.items.map((item) => <div key={item.name} className="flex justify-between rounded-xl bg-slate-50 p-3"><span>{item.name}</span><b>{formatInr(item.amount)}</b></div>)}</div><div className="rounded-xl border p-3"><p>Total: <b>{formatInr(bill.totalAmount)}</b></p><p>Paid: <b>{formatInr(bill.paidAmount)}</b></p><p>Balance: <b>{formatInr(bill.balance)}</b></p><p>Payment mode: <b>{labelFromValue(bill.paymentMode)}</b></p><p>Status: <b>{labelFromValue(bill.status)}</b></p></div></div>}</Modal>;
}
