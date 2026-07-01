import type { InputHTMLAttributes } from "react";
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 ${className}`} {...props} />; }
