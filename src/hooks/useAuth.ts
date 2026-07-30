import { services } from "../services/serviceProvider";

export function useAuth() {
  return { getCurrentUser: services.auth.getCurrentUser, loginAsRole: services.auth.loginAsRole, logout: services.auth.logout };
}
