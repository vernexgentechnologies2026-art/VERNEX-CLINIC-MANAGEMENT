import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { BrandLogo, Button, Input } from "../../../components/ui";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otp, setOtp] = useState("123456");
  const login = () => {
    localStorage.setItem("vernex_auth", "true");
    localStorage.setItem("vernex_role", "patient");
    navigate("/patient/dashboard");
  };

  return <main className="min-h-screen bg-[#f6f8fa] px-4 py-6"><div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-center"><div className="rounded-2xl bg-white p-5 shadow-card"><div className="flex items-center gap-3"><BrandLogo className="size-14" /><div><p className="text-sm font-bold text-brand-700">Vernex Clinic OS</p><h1 className="text-2xl font-bold">Patient Login</h1></div></div><p className="mt-4 text-sm leading-6 text-slate-500">Access your appointments, prescriptions, bills, and follow-ups.</p><div className="mt-6 space-y-4"><label className="block"><span className="mb-2 block text-sm font-semibold">Phone number</span><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></label><Button variant="secondary" className="w-full">Send OTP</Button><label className="block"><span className="mb-2 block text-sm font-semibold">OTP placeholder</span><Input value={otp} onChange={(e) => setOtp(e.target.value)} /></label><Button className="w-full" onClick={login}>Verify & Continue</Button></div><div className="mt-5 flex gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-700"><ShieldCheck className="size-4 shrink-0" /><p><b>Demo mode:</b> No real OTP is sent. Use any phone number and continue.</p></div></div></div></main>;
}
