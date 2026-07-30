export const mockConfig = {
  delayMs: 0,
  simulateErrors: false,
  useEmptyAppointments: false,
  useEmptyPharmacyQueue: false
};

export async function mockResolve<T>(data: T): Promise<T> {
  if (mockConfig.simulateErrors) throw { code: "MOCK_ERROR", message: "Simulated mock service error" };
  if (mockConfig.delayMs > 0) await new Promise((resolve) => setTimeout(resolve, mockConfig.delayMs));
  return data;
}
