import type { ClinicDepartment, WhatsAppConversationStatus, WhatsAppTemplateStatus } from "./types";

/** Turns a stored department key such as "general_medicine" into "General Medicine". */
export const departmentLabel = (department: ClinicDepartment | string) =>
  String(department).replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const templateStatusLabel: Record<WhatsAppTemplateStatus, string> = { active: "Active", draft: "Draft", needs_api_approval: "Needs API approval", disabled: "Disabled" };
export const conversationStatusLabel: Record<WhatsAppConversationStatus, string> = { new: "New", in_progress: "In progress", appointment_confirmed: "Appointment Confirmed", waiting_for_patient: "Waiting for Patient", transferred_to_reception: "Transferred to Reception", closed: "Closed", failed: "Failed" };
export const statusTone = (status: string) => status.includes("failed") || status.includes("disabled") ? "bg-rose-50 text-rose-700" : status.includes("confirmed") || status === "active" ? "bg-emerald-50 text-emerald-700" : status.includes("approval") || status.includes("waiting") ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";
