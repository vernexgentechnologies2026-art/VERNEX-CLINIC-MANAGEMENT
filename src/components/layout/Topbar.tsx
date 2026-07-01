import { Bell, Menu, Search } from "lucide-react";
import type { UserRole } from "../../types/user";
import { RoleSwitcher } from "./RoleSwitcher";
import { clinic } from "../../data/mockData";
export function Topbar({ role, openMenu }: { role: UserRole; openMenu: () => void }) {
  return <header className="sticky top-0 z-20 flex h-[76px] items-center border-b bg-white/95 px-4 backdrop-blur md:px-7">
    <button onClick={openMenu} className="mr-3 rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu /></button>
    <div className="hidden md:block"><p className="text-sm font-bold text-slate-800">{role === "super_admin" ? "Vernex Platform" : clinic.name}</p><p className="text-xs text-slate-500">Wednesday, 1 July 2026</p></div>
    <div className="mx-auto hidden max-w-md flex-1 lg:block"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input className="h-10 w-full rounded-xl border bg-slate-50 pl-9 pr-4 text-sm focus:border-brand-500" placeholder="Search patients, appointments, bills..." /></div></div>
    <div className="ml-auto flex items-center gap-2.5"><RoleSwitcher role={role} /><button className="relative rounded-xl border p-2.5 text-slate-500 hover:bg-slate-50" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" /></button><div className="grid size-10 place-items-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">{role === "doctor" ? "AR" : "VS"}</div></div>
  </header>;
}
