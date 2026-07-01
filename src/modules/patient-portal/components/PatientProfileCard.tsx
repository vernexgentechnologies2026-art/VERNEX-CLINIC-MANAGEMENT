import { Card } from "../../../components/ui";
import type { PatientPortalProfile } from "../types";
import { labelFromValue } from "../utils";

export function PatientProfileCard({ profile }: { profile: PatientPortalProfile }) {
  return <Card className="p-4"><h2 className="text-lg font-bold">{profile.name}</h2><p className="text-sm text-slate-500">{profile.age} years • {labelFromValue(profile.gender)} • {profile.bloodGroup}</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p><b>Phone:</b> {profile.phone}</p><p><b>Email:</b> {profile.email}</p><p><b>Address:</b> {profile.address}</p><p><b>Emergency:</b> {profile.emergencyContact}</p><p><b>Allergies:</b> {profile.allergies.join(", ") || "None"}</p><p><b>Conditions:</b> {profile.existingConditions.join(", ") || "None"}</p><p><b>Current medicines:</b> {profile.currentMedications.join(", ") || "None"}</p></div></Card>;
}
