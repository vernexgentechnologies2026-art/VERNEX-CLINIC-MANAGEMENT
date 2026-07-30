import { Input } from "../../../components/ui";
export function VitalsForm() {
  return <section className="card p-5"><h2 className="font-bold">Vitals</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Temperature", "BP", "Pulse", "Weight", "Height", "SpO2", "Sugar level"].map((x) => <Input key={x} placeholder={x} />)}</div></section>;
}
