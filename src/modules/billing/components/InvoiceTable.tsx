import { Button } from "../../../components/ui";
import type { Invoice } from "../types";
import { billTypeLabel, rupee } from "../utils";
import { InvoiceCard } from "./InvoiceCard";
import { PaymentModeBadge } from "./PaymentModeBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
export function InvoiceTable({ invoices, onView }: { invoices: Invoice[]; onView?: (invoice: Invoice) => void }) { return <><div className="grid gap-3 md:hidden">{invoices.map((i) => <InvoiceCard key={i.id} invoice={i} onView={() => onView?.(i)} />)}</div><div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Invoice</th><th>Patient</th><th>Phone</th><th>Type</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Mode</th><th>Date</th><th>Actions</th></tr></thead><tbody>{invoices.map((i) => <tr key={i.id}><td className="font-bold">{i.id}</td><td>{i.patientName}</td><td>{i.phone}</td><td>{billTypeLabel[i.billType]}</td><td>{rupee(i.total)}</td><td>{rupee(i.paidAmount)}</td><td>{rupee(i.balance)}</td><td><PaymentStatusBadge status={i.paymentStatus} /></td><td><PaymentModeBadge mode={i.paymentMode} /></td><td>{i.date}</td><td><div className="flex gap-2"><Button className="min-h-8 px-3 py-1" onClick={() => onView?.(i)}>View</Button><Button variant="ghost" className="min-h-8 px-3 py-1">Print</Button></div></td></tr>)}</tbody></table></div></>; }
