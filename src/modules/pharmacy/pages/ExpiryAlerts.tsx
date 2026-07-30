import { useState } from "react";
import { Button, PageHeader } from "../../../components/ui";
import { getMedicines } from "../../../services/pharmacy.service";
import { ExpiryAlertCard } from "../components/ExpiryAlertCard";
import type { ExpiryStatus } from "../types";
export default function ExpiryAlerts() { const [tab, setTab] = useState<ExpiryStatus>("expiring_soon"); const rows = getMedicines().filter((m) => m.expiryStatus === tab); return <div className="space-y-5"><PageHeader title="Expiry Alerts" description="Track expiring soon, expired, and safe medicine batches." /><div className="flex flex-wrap gap-2"><Button variant={tab === "expiring_soon" ? "primary" : "secondary"} onClick={() => setTab("expiring_soon")}>Expiring Soon</Button><Button variant={tab === "expired" ? "primary" : "secondary"} onClick={() => setTab("expired")}>Expired</Button><Button variant={tab === "safe" ? "primary" : "secondary"} onClick={() => setTab("safe")}>Safe Stock</Button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((m) => <ExpiryAlertCard key={m.id} medicine={m} />)}</div></div>; }
