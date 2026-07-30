import type { ReminderRecord } from "../shared/types/domain";

export const mockReminders: ReminderRecord[] = [
  { id: "rem-med-1001", patientId: "patient-neha", prescriptionItemId: "rx-item-1001-a", type: "medicine", status: "active", deliveryStatus: "queued", nextRunAt: "2026-07-09T20:00:00+05:30" },
  { id: "rem-follow-1001", patientId: "patient-neha", type: "follow_up", status: "active", deliveryStatus: "sent", nextRunAt: "2026-07-10T09:00:00+05:30" },
  { id: "rem-cancelled-1", patientId: "patient-ananya", type: "medicine", status: "cancelled", deliveryStatus: "failed", nextRunAt: "2026-07-09T21:00:00+05:30" }
];
