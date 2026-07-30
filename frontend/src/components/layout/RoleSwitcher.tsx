import type { UserRole } from "../../types/user";
const roles: UserRole[] = ["owner", "receptionist", "doctor", "pharmacist", "super_admin"];
const labels: Record<UserRole, string> = { owner: "Owner", receptionist: "Receptionist", doctor: "Doctor", pharmacist: "Pharmacist", super_admin: "Super Admin" };
export function RoleSwitcher({ role }: { role: UserRole }) {
  return <select aria-label="Current staff role" value={role} disabled className="h-10 max-w-[150px] rounded-lg border bg-white px-2.5 text-xs font-bold text-slate-700 transition disabled:opacity-100 sm:max-w-none">{roles.map((r) => <option key={r} value={r}>{labels[r]}</option>)}</select>;
}
