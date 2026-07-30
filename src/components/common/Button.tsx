import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"; size?: "sm" | "md" | "lg" | "icon"; icon?: ReactNode; loading?: boolean };
export function Button({ variant = "primary", size = "md", icon, loading, className = "", children, disabled, ...props }: Props) {
  const styles = { primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm", secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50", outline: "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50", ghost: "text-slate-600 hover:bg-slate-100", danger: "bg-rose-600 text-white hover:bg-rose-700" };
  const sizes = { sm: "min-h-9 px-3 py-1.5 text-xs", md: "min-h-11 px-4 py-2 text-sm", lg: "min-h-12 px-5 py-2.5 text-sm", icon: "size-11 p-0" };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-55 ${styles[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>{loading ? <Loader2 className="size-4 animate-spin" /> : icon}{size !== "icon" && children}</button>;
}
