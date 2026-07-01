import type { SelectHTMLAttributes } from "react";
export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 ${className}`} {...props} />; }
