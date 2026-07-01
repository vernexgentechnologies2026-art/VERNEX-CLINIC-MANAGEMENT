import { Card, PageHeader } from "../../../components/ui";
import { getRefunds } from "../../../services/billing.service";
import { RefundRequestCard } from "../components/RefundRequestCard";
export default function Refunds() { const refunds = getRefunds(); return <div className="space-y-5"><PageHeader title="Refunds" description="Refund requests, refunded bills, and cancelled bill placeholders." /><Card className="p-5"><h2 className="font-bold">Refund requests</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{refunds.map((r) => <RefundRequestCard key={r.id} refund={r} />)}</div></Card></div>; }
