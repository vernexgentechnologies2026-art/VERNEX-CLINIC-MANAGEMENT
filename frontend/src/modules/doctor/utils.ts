import type { DoctorQueueStatus, FollowUpStatus, PatientTag } from "./types";

export const queueStatusLabel: Record<DoctorQueueStatus, string> = { waiting: "Waiting", in_consultation: "In consultation", completed: "Completed", no_show: "No-show" };
export const followUpStatusLabel: Record<FollowUpStatus, string> = { due_today: "Due today", upcoming: "Upcoming", overdue: "Overdue", completed: "Completed" };
export const ageGender = (age: number, gender: string) => `${age} yrs · ${gender}`;
export const tagTone = (tag: PatientTag) => tag === "VIP" ? "bg-amber-50 text-amber-700" : tag === "Senior Citizen" ? "bg-violet-50 text-violet-700" : tag === "New Patient" ? "bg-blue-50 text-blue-700" : "bg-brand-50 text-brand-700";
