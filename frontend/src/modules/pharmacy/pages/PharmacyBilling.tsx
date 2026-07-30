import { PageHeader } from "../../../components/ui";
import { PharmacyBillBuilder } from "../components/PharmacyBillBuilder";
export default function PharmacyBilling() { return <div className="space-y-5"><PageHeader title="Pharmacy Billing" description="Prescription-to-bill workflow with stock check and receipt preview." /><PharmacyBillBuilder /></div>; }
