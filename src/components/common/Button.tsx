import type { ButtonHTMLAttributes, ReactNode } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: ReactNode };
export function Button({ variant = "primary", icon, className = "", children, ...props }: Props) {
  const styles = { primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm", secondary: "border bg-white text-slate-700 hover:bg-slate-50", ghost: "text-slate-600 hover:bg-slate-100", danger: "bg-rose-600 text-white hover:bg-rose-700" };
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{icon}{children}</button>;
}
