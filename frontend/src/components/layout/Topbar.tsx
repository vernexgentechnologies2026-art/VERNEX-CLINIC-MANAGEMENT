import { LogOut, PanelLeftClose, PanelLeftOpen, Search, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { services } from "../../services/serviceProvider";
import type { PatientRecord } from "../../shared/types/domain";
import type { UserRole } from "../../types/user";
import { Button } from "../common/Button";
import { RoleSwitcher } from "./RoleSwitcher";

function initials(name: string, role: UserRole) {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  return letters.toUpperCase() || (role === "super_admin" ? "SA" : "VX");
}

export function Topbar({ role, openMenu, collapsed, toggleCollapsed }: { role: UserRole; openMenu: () => void; collapsed: boolean; toggleCollapsed: () => void }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(role === "super_admin" ? "Vernex Platform" : "");
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientRecord[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    void services.auth.getCurrentAuthContext().then((context) => {
      if (!mounted) return;
      setUserName(context.fullName);
      const clinic = context.clinic as { name?: string } | null;
      setWorkspaceName(role === "super_admin" ? "Vernex Platform" : clinic?.name ?? "");
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, [role]);

  // Debounced patient lookup for the global search box.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) { setResults([]); return; }
    let mounted = true;
    setSearching(true);
    const timer = setTimeout(() => {
      void services.patients
        .searchPatients(term)
        .then((rows) => { if (mounted) setResults(rows.slice(0, 6)); })
        .catch(() => { if (mounted) setResults([]); })
        .finally(() => { if (mounted) setSearching(false); });
    }, 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setResults([]);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openPatient = (patient: PatientRecord) => {
    setQuery(""); setResults([]);
    navigate(`/doctor/patient/${patient.id}`);
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await services.auth.signOut();
      localStorage.removeItem("vernex_auth");
      localStorage.removeItem("vernex_role");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return <header className="sticky top-0 z-20 flex min-h-[72px] items-center border-b bg-white/95 px-4 backdrop-blur md:px-6">
    <button onClick={openMenu} className="mr-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
    <Button size="icon" variant="ghost" className="mr-2 hidden lg:inline-flex" onClick={toggleCollapsed} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} icon={collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />} />
    <div className="hidden min-w-0 md:block"><p className="truncate text-sm font-bold text-slate-900">{workspaceName || "Vernex Clinic OS"}</p><p className="text-xs text-slate-500">{today}</p></div>

    <div ref={searchRef} className="mx-auto hidden max-w-xl flex-1 px-6 lg:block">
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-11 w-full rounded-lg border bg-slate-50 pl-9 pr-4 text-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          placeholder="Search patients by name or phone..."
          aria-label="Search patients"
        />
      </label>
      {query.trim().length >= 2 && <div className="absolute z-30 mt-1 w-[min(36rem,calc(100%-3rem))] overflow-hidden rounded-xl border bg-white shadow-card">
        {searching ? <p className="px-4 py-3 text-sm text-slate-500">Searching...</p>
          : results.length === 0 ? <p className="px-4 py-3 text-sm text-slate-500">No patients found.</p>
          : results.map((patient) => <button key={patient.id} onClick={() => openPatient(patient)} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50">
              <b>{patient.fullName}</b><span className="ml-2 text-slate-500">{patient.phone}</span>
            </button>)}
      </div>}
    </div>

    <div className="ml-auto flex items-center gap-2">
      <RoleSwitcher role={role} />
      <Button size="icon" variant="secondary" aria-label="Log out" onClick={logout} loading={loggingOut} icon={<LogOut className="size-4" />} />
      <div className="grid size-10 place-items-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700" title={userName}>{initials(userName, role)}</div>
    </div>
  </header>;
}
