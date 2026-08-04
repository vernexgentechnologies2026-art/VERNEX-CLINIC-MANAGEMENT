import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, ShieldCheck } from "lucide-react";
import { homeForRole } from "../../components/layout/navigation";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { BrandLogo } from "../../components/common/BrandLogo";
import { useAuth } from "../../hooks/useAuth";
export default function Login() {
  const navigate = useNavigate(); const auth = useAuth(); const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const context = await auth.signInWithPassword(String(form.get("login") ?? ""), String(form.get("password") ?? ""));
      navigate(homeForRole[context.role_key], { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };
  return <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[#083f48] p-12 text-white lg:flex lg:flex-col"><div className="absolute -right-32 top-10 size-96 rounded-full bg-brand-500/15" /><div className="absolute -bottom-24 left-20 size-72 rounded-full border-[50px] border-white/5" />
      <div className="relative flex items-center gap-3"><div className="rounded-2xl bg-white p-1 shadow-lg"><BrandLogo className="size-14" /></div><div><p className="font-['Manrope'] text-xl font-extrabold">Vernex Clinic OS</p><p className="text-xs text-brand-100">Care, connected.</p></div></div>
      <div className="relative my-auto max-w-xl"><p className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-brand-100">One calm workspace</p><h1 className="text-4xl font-bold leading-tight xl:text-5xl">Your clinic, beautifully organised.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-200">From the first appointment to the final bill, give your team the clarity to focus on better patient care.</p>
        <div className="mt-10 grid gap-4 text-sm sm:grid-cols-2">{["Faster front-desk workflows", "Complete patient context", "Clear financial insights", "Secure role-based access"].map((t) => <div className="flex items-center gap-2.5" key={t}><CheckCircle2 className="size-5 text-brand-100" />{t}</div>)}</div>
      </div><div className="relative flex items-center gap-2 text-xs text-slate-300"><ShieldCheck className="size-4" />Built for modern Indian clinics</div>
    </section>
    <section className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><BrandLogo className="size-14" /><p className="font-['Manrope'] text-lg font-extrabold">Vernex Clinic OS</p></div><p className="text-sm font-bold text-brand-700">WELCOME BACK</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Sign in to your clinic</h2><p className="mt-2 text-sm text-slate-500">Appointments · Records · Pharmacy · Billing · Reports</p>
      <form onSubmit={login} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-sm font-semibold">Email or staff ID</span><Input name="login" type="text" placeholder="you@clinic.com or VNX-STAFF-ID" autoComplete="username" required /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><span className="relative block"><Input name="password" type={show ? "text" : "password"} autoComplete="current-password" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Eye className="size-4" /></button></span></label>{error && <div className="rounded-xl bg-rose-50 p-3.5 text-xs font-semibold leading-5 text-rose-700">{error}</div>}<Button className="w-full" type="submit" loading={loading}>Enter workspace <ArrowRight className="size-4" /></Button></form>
      <div className="mt-6 rounded-xl bg-brand-50 p-3.5 text-xs leading-5 text-brand-700"><strong>Staff access:</strong> Sign in with your Supabase staff email or Vernex staff ID.</div><p className="mt-8 text-center text-sm text-slate-500">Booking a visit? <Link className="font-semibold text-brand-700" to="/book/vernex-clinic">Book an appointment</Link></p>
    </div></section>
  </main>;
}
