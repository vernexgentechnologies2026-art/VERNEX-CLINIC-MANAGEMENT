import type { UserRole } from "../types/user";
import { services } from "../services/serviceProvider";
import { useAsyncData } from "./useAsyncData";

export function useCurrentUser(role?: UserRole) {
  return useAsyncData(() => services.auth.getCurrentUser(role), [role]);
}
