export interface Patient { id: string; name: string; phone: string; age: number; gender: "Male" | "Female" | "Other"; bloodGroup?: string; lastVisit?: string; visits: number; }
export interface FollowUp { id: string; patientId: string; patientName: string; dueDate: string; reason: string; status: "due" | "scheduled" | "completed"; }
