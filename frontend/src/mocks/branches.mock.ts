import type { BranchRecord } from "../shared/types/domain";

// Branch IDs are referenced by users, appointments, inventory, invoices, and support tickets.
export const mockBranches: BranchRecord[] = [
  { id: "branch-indiranagar", clinicId: "clinic-vernex", name: "Indiranagar Main", address: "12, 5th Main Road, Indiranagar, Bengaluru", phone: "+91 98765 43210", isPrimary: true },
  { id: "branch-whitefield", clinicId: "clinic-vernex", name: "Whitefield Extension", address: "88, ITPL Road, Bengaluru", phone: "+91 98765 43211", isPrimary: false },
  { id: "branch-anna-nagar", clinicId: "clinic-small", name: "Anna Nagar", address: "8, Anna Nagar Main Road, Chennai", phone: "+91 91234 56780", isPrimary: true }
];
