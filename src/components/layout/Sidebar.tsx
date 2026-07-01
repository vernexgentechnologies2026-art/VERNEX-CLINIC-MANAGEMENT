import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import type { UserRole } from "../../types/user";
import { navForRole } from "./navigation";
import { BrandLogo } from "../common/BrandLogo";
export function Sidebar({ role, mobileOpen, close }: { role: UserRole; mobileOpen: boolean; close: () => void }) {
  return <><div onClick={close} className={`fixed inset-0 z-30 bg-slate-950/30 lg:hidden ${mobileOpen ? "block" : "hidden"}`} /><aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r bg-white transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex h-[76px] items-center gap-3 border-b px-5"><BrandLogo className="size-12" /><div><div className="font-['Manrope'] font-extrabold text-slate-900">Vernex</div><div className="text-xs font-medium text-brand-700">Clinic OS</div></div><button className="ml-auto lg:hidden" onClick={close}><X className="size-5" /></button></div>
    <div className="px-4 pt-5"><p className="px-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</p></div>
    <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-4 pb-6">{navForRole[role].map(({ label, path, icon: Icon }) => <NavLink key={label} to={path} onClick={close} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon className="size-[18px]" />{label}</NavLink>)}</nav>
    <div className="m-4 rounded-2xl bg-slate-900 p-4 text-white"><p className="text-sm font-semibold">Need a hand?</p><p className="mt-1 text-xs leading-5 text-slate-300">Vernex support is available Mon–Sat.</p><button className="mt-3 text-xs font-bold text-brand-100">Contact support →</button></div>
  </aside></>;
}
