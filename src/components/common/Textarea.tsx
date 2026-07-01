import type { TextareaHTMLAttributes } from "react";
export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 ${className}`} {...props} />; }
