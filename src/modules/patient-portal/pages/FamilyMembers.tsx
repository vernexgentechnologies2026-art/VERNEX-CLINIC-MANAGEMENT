import { Button } from "../../../components/ui";
import { getFamilyMembers } from "../../../services/patientPortal.service";
import { FamilyMemberCard } from "../components/FamilyMemberCard";
import { PatientEmptyState } from "../components/PatientEmptyState";

export default function FamilyMembers() {
  const members = getFamilyMembers();
  return <div className="mx-auto max-w-4xl space-y-5 pb-20"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold">Family Members</h1><p className="text-sm text-slate-500">Manage family profiles using one phone number.</p></div><Button>Add Family Member</Button></div>{members.length === 0 ? <PatientEmptyState title="No family members" description="Add family profiles to book and manage visits together." /> : <div className="space-y-3">{members.map((member) => <FamilyMemberCard key={member.id} member={member} />)}</div>}</div>;
}
