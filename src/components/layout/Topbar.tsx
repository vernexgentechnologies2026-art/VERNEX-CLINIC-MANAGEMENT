import { Bell, PanelLeftClose, PanelLeftOpen, Search, Menu } from "lucide-react";
import type { UserRole } from "../../types/user";
import { Button } from "../common/Button";
import { RoleSwitcher } from "./RoleSwitcher";

export function Topbar({ role, openMenu, collapsed, toggleCollapsed }: { role: UserRole; openMenu: () => void; collapsed: boolean; toggleCollapsed: () => void }) {
  const workspaceName = role === "super_admin" ? "Vernex Platform" : "Vernex Multispeciality Clinic";

  return <header className="sticky top-0 z-20 flex min-h-[72px] items-center border-b bg-white/95 px-4 backdrop-blur md:px-6">
    <button onClick={openMenu} className="mr-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
    <Button size="icon" variant="ghost" className="mr-2 hidden lg:inline-flex" onClick={toggleCollapsed} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} icon={collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />} />
    <div className="hidden min-w-0 md:block"><p className="truncate text-sm font-bold text-slate-900">{workspaceName}</p><p className="text-xs text-slate-500">Thursday, 9 July 2026</p></div>
    <div className="mx-auto hidden max-w-xl flex-1 px-6 lg:block"><label className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input className="h-11 w-full rounded-lg border bg-slate-50 pl-9 pr-4 text-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15" placeholder="Search patients, appointments, invoices..." aria-label="Global search" /></label></div>
    <div className="ml-auto flex items-center gap-2"><RoleSwitcher role={role} /><Button size="icon" variant="secondary" aria-label="Notifications" icon={<Bell className="size-4" />} /><div className="grid size-10 place-items-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">{role === "doctor" ? "DR" : role === "super_admin" ? "SA" : "VS"}</div></div>
  </header>;
}
