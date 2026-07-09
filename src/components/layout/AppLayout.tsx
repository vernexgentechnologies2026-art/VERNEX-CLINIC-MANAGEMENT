import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import type { UserRole } from "../../types/user";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
const validRoles: UserRole[] = ["owner", "receptionist", "doctor", "pharmacist", "super_admin"];
const storedRole = (): UserRole => {
  const role = localStorage.getItem("vernex_role") as UserRole | null;
  return role && validRoles.includes(role) ? role : "owner";
};
export function AppLayout() {
  const [role, setRole] = useState<UserRole>(storedRole);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { const sync = () => setRole(storedRole()); window.addEventListener("vernex-role", sync); return () => window.removeEventListener("vernex-role", sync); }, []);
  return <div className="min-h-screen"><Sidebar role={role} mobileOpen={mobileOpen} collapsed={collapsed} close={() => setMobileOpen(false)} toggleCollapsed={() => setCollapsed((value) => !value)} /><div className={collapsed ? "lg:pl-[88px]" : "lg:pl-[268px]"}><Topbar role={role} openMenu={() => setMobileOpen(true)} collapsed={collapsed} toggleCollapsed={() => setCollapsed((value) => !value)} /><main className="mx-auto w-full max-w-[1480px] p-4 md:p-6 xl:p-7"><Outlet /></main></div></div>;
}
