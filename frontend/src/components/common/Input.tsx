import type { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; helperText?: string; error?: string; requiredMark?: boolean };
export function Input({ label, helperText, error, requiredMark, className = "", id, ...props }: Props) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\W+/g, "-") : undefined);
  const input = <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined} className={`min-h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 transition disabled:bg-slate-100 disabled:text-slate-500 ${error ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15" : "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"} ${className}`} {...props} />;
  if (!label && !helperText && !error) return input;
  return <label className="block">{label && <span className="field-label">{label}{requiredMark && <span className="text-rose-600"> *</span>}</span>}{input}{helperText && !error && <p id={`${inputId}-helper`} className="helper-text mt-1.5">{helperText}</p>}{error && <p id={`${inputId}-error`} className="field-error">{error}</p>}</label>;
}
