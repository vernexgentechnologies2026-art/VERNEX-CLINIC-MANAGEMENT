import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../types/user";
import { homeForRole } from "./navigation";
const roles: UserRole[] = ["owner", "receptionist", "doctor", "pharmacist", "patient", "super_admin"];
export function RoleSwitcher({ role }: { role: UserRole }) {
  const navigate = useNavigate();
  const change = (next: UserRole) => { localStorage.setItem("vernex_role", next); window.dispatchEvent(new Event("vernex-role")); navigate(homeForRole[next]); };
  return <select aria-label="Switch demo role" value={role} onChange={(e) => change(e.target.value as UserRole)} className="rounded-lg border bg-white px-2.5 py-2 text-xs font-semibold capitalize text-slate-600">{roles.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}</select>;
}
