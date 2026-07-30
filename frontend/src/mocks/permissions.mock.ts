import type { PermissionKey } from "../shared/types/domain";

export const mockPermissions: { key: PermissionKey; label: string }[] = [
  "view", "create", "edit", "assign", "approve", "cancel", "delete", "bill", "dispense", "export", "manage", "configure"
].map((key) => ({ key: key as PermissionKey, label: key.replace("_", " ") }));
