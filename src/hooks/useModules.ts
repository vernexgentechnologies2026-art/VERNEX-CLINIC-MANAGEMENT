import type { UserRecord } from "../shared/types/domain";

export function useModules(user?: UserRecord | null) {
  return { modules: user?.modules ?? [], hasModule: (module: string) => Boolean(user?.modules.includes(module as never)) };
}
