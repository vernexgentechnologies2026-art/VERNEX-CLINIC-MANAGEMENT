import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DoctorPerformanceReport } from "../types";
export function DoctorRevenueChart({ data }: { data: DoctorPerformanceReport[] }) { return <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="doctorName" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#087f8c" /></BarChart></ResponsiveContainer></div>; }
