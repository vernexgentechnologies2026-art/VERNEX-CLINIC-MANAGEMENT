import { services } from "../services/serviceProvider";
import { useAsyncData } from "./useAsyncData";

export function useClinicContext(clinicId = "clinic-vernex") {
  return useAsyncData(async () => ({ clinic: await services.clinics.getClinicById(clinicId), branches: await services.clinics.getBranches(clinicId), enabledModules: await services.clinics.getEnabledModules(clinicId) }), [clinicId]);
}
