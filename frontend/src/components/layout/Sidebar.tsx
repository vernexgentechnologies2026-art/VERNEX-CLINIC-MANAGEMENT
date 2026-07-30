import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { ModuleKey, UserRecord } from "../../shared/types/domain";
import { services } from "../../services/serviceProvider";
import type { UserRole } from "../../types/user";
import { BrandLogo } from "../common/BrandLogo";
import { getNavigationForUser } from "./navigation";

const roleLabel: Record<UserRole, string> = { owner: "Owner Workspace", receptionist: "Reception Desk", doctor: "Doctor Workspace", pharmacist: "Pharmacy", super_admin: "Platform Admin" };

export function Sidebar({ role, mobileOpen, collapsed, close, toggleCollapsed }: { role: UserRole; mobileOpen: boolean; collapsed: boolean; close: () => void; toggleCollapsed: () => void }) {
  const [accessContext, setAccessContext] = useState<{ user: UserRecord; enabledClinicModules: ModuleKey[] } | null>(null);
  useEffect(() => {
    let mounted = true;
    Promise.all([services.auth.getCurrentUser(), services.auth.getCurrentAuthContext()])
      .then(([user, context]) => { if (mounted) setAccessContext({ user, enabledClinicModules: context.enabledModules as ModuleKey[] }); })
      .catch(() => { if (mounted) setAccessContext(null); });
    return () => { mounted = false; };
  }, [role]);
  const navigation = accessContext ? getNavigationForUser(accessContext.user, accessContext.enabledClinicModules, accessContext.user.modules, accessContext.user.permissions) : [];
  return <><button aria-label="Close navigation overlay" onClick={close} className={`fixed inset-0 z-30 bg-slate-950/35 lg:hidden ${mobileOpen ? "block" : "hidden"}`} /><aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-white transition-all duration-200 lg:translate-x-0 ${collapsed ? "lg:w-[88px]" : "lg:w-[268px]"} ${mobileOpen ? "w-[286px] translate-x-0" : "w-[286px] -translate-x-full"}`}>
    <div className="flex h-[76px] items-center gap-3 border-b px-4"><BrandLogo className="size-11" />{!collapsed && <div className="min-w-0"><div className="font-['Manrope'] font-extrabold text-slate-950">Vernex</div><div className="text-xs font-semibold text-brand-700">Clinic OS</div></div>}<button className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={close} aria-label="Close menu"><X className="size-5" /></button><button className="ml-auto hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:grid" onClick={toggleCollapsed} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}</button></div>
    <div className="px-4 pt-5">{!collapsed && <p className="px-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">{roleLabel[role]}</p>}</div>
    <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-4 pb-6">{navigation.map(({ label, path, icon: Icon }) => <NavLink key={label} to={path} onClick={close} title={collapsed ? label : undefined} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${collapsed ? "justify-center" : ""} ${isActive ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}><Icon className="size-[18px] shrink-0" />{!collapsed && <span className="truncate">{label}</span>}</NavLink>)}</nav>
    {!collapsed && <div className="m-4 rounded-card bg-slate-950 p-4 text-white"><p className="text-sm font-semibold">Support</p><p className="mt-1 text-xs leading-5 text-slate-300">Mon-Sat clinic operations help.</p><button className="mt-3 text-xs font-bold text-brand-100">Contact support</button></div>}
  </aside></>;
}
