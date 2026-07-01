import { Badge } from "../../../components/ui";
import { labelFromValue, statusClass } from "../utils";

export function PatientStatusBadge({ status }: { status: string }) {
  return <Badge className={statusClass(status as never)}>{labelFromValue(status)}</Badge>;
}
