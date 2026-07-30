import type { LabTest } from "../types";
export function LabTestSuggestionPanel({ tests }: { tests: LabTest[] }) {
  return <div className="card p-5"><h2 className="font-bold">Lab Test Suggestions</h2><div className="mt-3 flex flex-wrap gap-2">{tests.map((test) => <label key={test.id} className="rounded-full border px-3 py-1.5 text-sm font-semibold"><input type="checkbox" className="mr-2" />{test.name}</label>)}</div></div>;
}
