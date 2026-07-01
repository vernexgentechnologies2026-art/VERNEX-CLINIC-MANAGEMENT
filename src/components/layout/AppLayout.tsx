import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import type { UserRole } from "../../types/user";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
export function AppLayout() {
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem("vernex_role") as UserRole) || "owner");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const sync = () => setRole((localStorage.getItem("vernex_role") as UserRole) || "owner"); window.addEventListener("vernex-role", sync); return () => window.removeEventListener("vernex-role", sync); }, []);
  return <div className="min-h-screen"><Sidebar role={role} mobileOpen={mobileOpen} close={() => setMobileOpen(false)} /><div className="lg:pl-[268px]"><Topbar role={role} openMenu={() => setMobileOpen(true)} /><main className="mx-auto max-w-[1600px] p-4 md:p-7"><Outlet /></main></div></div>;
}
