import type { TextareaHTMLAttributes } from "react";
type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; helperText?: string; error?: string; requiredMark?: boolean };
export function Textarea({ label, helperText, error, requiredMark, className = "", id, ...props }: Props) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\W+/g, "-") : undefined);
  const textarea = <textarea id={textareaId} aria-invalid={Boolean(error)} className={`min-h-24 w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition disabled:bg-slate-100 disabled:text-slate-500 ${error ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15" : "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"} ${className}`} {...props} />;
  if (!label && !helperText && !error) return textarea;
  return <label className="block">{label && <span className="field-label">{label}{requiredMark && <span className="text-rose-600"> *</span>}</span>}{textarea}{helperText && !error && <p className="helper-text mt-1.5">{helperText}</p>}{error && <p className="field-error">{error}</p>}</label>;
}
