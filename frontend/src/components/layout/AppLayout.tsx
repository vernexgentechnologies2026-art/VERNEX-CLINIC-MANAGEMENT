import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingSkeleton } from "../ui";
import { services } from "../../services/serviceProvider";
import type { UserRole } from "../../types/user";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
export function AppLayout() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    let mounted = true;
    const sync = () => services.auth.getCurrentAuthContext().then((context) => { if (mounted) { setRole(context.role_key); setChecked(true); } }).catch(() => { if (mounted) { setRole(null); setChecked(true); } });
    sync();
    window.addEventListener("vernex-role", sync);
    return () => { mounted = false; window.removeEventListener("vernex-role", sync); };
  }, []);
  if (!checked) return <main className="p-5 md:p-7"><LoadingSkeleton rows={4} /></main>;
  if (!role) return <Navigate to="/login" replace />;
  const displayRole = role;
  return <div className="min-h-screen"><Sidebar role={displayRole} mobileOpen={mobileOpen} collapsed={collapsed} close={() => setMobileOpen(false)} toggleCollapsed={() => setCollapsed((value) => !value)} /><div className={collapsed ? "lg:pl-[88px]" : "lg:pl-[268px]"}><Topbar role={displayRole} openMenu={() => setMobileOpen(true)} collapsed={collapsed} toggleCollapsed={() => setCollapsed((value) => !value)} /><main className="mx-auto w-full max-w-[1480px] p-4 md:p-6 xl:p-7"><Outlet /></main></div></div>;
}
