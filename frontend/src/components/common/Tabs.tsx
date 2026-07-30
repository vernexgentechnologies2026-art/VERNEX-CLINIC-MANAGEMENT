export type TabItem = { id: string; label: string };
export function Tabs({ items, value, onChange }: { items: TabItem[]; value: string; onChange: (id: string) => void }) {
  return <div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1" role="tablist">{items.map((item) => <button key={item.id} role="tab" aria-selected={value === item.id} onClick={() => onChange(item.id)} className={`min-h-9 whitespace-nowrap rounded-md px-3 text-sm font-semibold transition ${value === item.id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</button>)}</div>;
}
