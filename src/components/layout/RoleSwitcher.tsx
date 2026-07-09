import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../types/user";
import { homeForRole } from "./navigation";
const roles: UserRole[] = ["owner", "receptionist", "doctor", "pharmacist", "super_admin"];
const labels: Record<UserRole, string> = { owner: "Owner", receptionist: "Receptionist", doctor: "Doctor", pharmacist: "Pharmacist", super_admin: "Super Admin" };
export function RoleSwitcher({ role }: { role: UserRole }) {
  const navigate = useNavigate();
  const change = (next: UserRole) => { localStorage.setItem("vernex_role", next); window.dispatchEvent(new Event("vernex-role")); navigate(homeForRole[next]); };
  return <select aria-label="Switch demo role" value={role} onChange={(e) => change(e.target.value as UserRole)} className="h-10 max-w-[150px] rounded-lg border bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:border-brand-500 sm:max-w-none">{roles.map((r) => <option key={r} value={r}>{labels[r]}</option>)}</select>;
}
