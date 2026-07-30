import { Input } from "./Input";

export function DateRangePicker({ from = "2026-07-09", to = "2026-07-16" }: { from?: string; to?: string }) {
  return <div className="grid gap-2 sm:grid-cols-2"><Input type="date" defaultValue={from} aria-label="From date" /><Input type="date" defaultValue={to} aria-label="To date" /></div>;
}
