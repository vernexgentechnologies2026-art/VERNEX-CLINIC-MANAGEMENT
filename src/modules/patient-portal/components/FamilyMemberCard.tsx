import { Button, Card } from "../../../components/ui";
import type { FamilyMember } from "../types";

export function FamilyMemberCard({ member }: { member: FamilyMember }) {
  return <Card className="p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold">{member.name}</h3><p className="text-sm text-slate-500">{member.relation} • {member.age} years • {member.gender}</p><p className="mt-2 text-xs text-slate-500">Last visit: {member.lastVisit} • Active prescriptions: {member.activePrescriptions}</p></div><div className="flex flex-wrap gap-2"><Button>Book Appointment</Button><Button variant="secondary">Switch Profile</Button></div></div></Card>;
}
