import type { SelectHTMLAttributes } from "react";
type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; helperText?: string; error?: string; requiredMark?: boolean };
export function Select({ label, helperText, error, requiredMark, className = "", id, ...props }: Props) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\W+/g, "-") : undefined);
  const select = <select id={selectId} aria-invalid={Boolean(error)} className={`min-h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-800 transition disabled:bg-slate-100 disabled:text-slate-500 ${error ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15" : "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"} ${className}`} {...props} />;
  if (!label && !helperText && !error) return select;
  return <label className="block">{label && <span className="field-label">{label}{requiredMark && <span className="text-rose-600"> *</span>}</span>}{select}{helperText && !error && <p className="helper-text mt-1.5">{helperText}</p>}{error && <p className="field-error">{error}</p>}</label>;
}
