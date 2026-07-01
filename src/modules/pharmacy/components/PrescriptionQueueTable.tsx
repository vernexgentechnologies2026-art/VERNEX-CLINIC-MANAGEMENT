import { Button } from "../../../components/ui";
import type { PrescriptionQueueItem } from "../types";
import { PharmacyPaymentBadge, PrescriptionStatusBadge } from "./StockStatusBadge";
import { PrescriptionQueueCard } from "./PrescriptionQueueCard";

export function PrescriptionQueueTable({ items, onView }: { items: PrescriptionQueueItem[]; onView?: (item: PrescriptionQueueItem) => void }) {
  return <><div className="grid gap-3 md:hidden">{items.map((item) => <PrescriptionQueueCard key={item.id} item={item} onView={() => onView?.(item)} />)}</div><div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Token</th><th>Patient</th><th>Phone</th><th>Doctor</th><th>Diagnosis</th><th>Medicines</th><th>Time</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td className="font-bold">{item.token}</td><td className="font-semibold">{item.patientName}</td><td>{item.phone}</td><td>{item.doctorName}</td><td>{item.diagnosis}</td><td>{item.medicines.length}</td><td>{item.prescriptionTime}</td><td><PrescriptionStatusBadge status={item.status} /></td><td><PharmacyPaymentBadge status={item.paymentStatus} /></td><td><div className="flex flex-wrap gap-2"><Button className="min-h-8 px-3 py-1" onClick={() => onView?.(item)}>View</Button><Button variant="secondary" className="min-h-8 px-3 py-1">Create Bill</Button><Button variant="ghost" className="min-h-8 px-3 py-1">Print</Button></div></td></tr>)}</tbody></table></div></>;
}
