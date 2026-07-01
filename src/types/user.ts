export type UserRole = "owner" | "receptionist" | "doctor" | "pharmacist" | "patient" | "super_admin";
export interface User { id: string; name: string; email: string; role: UserRole; clinicId?: string; }
