import { mockResolve } from "../../mocks/mockConfig";
import type { MonitoringLog, MonitoringLogInput, MonitoringService, SystemHealthLog } from "../interfaces";

const logs: MonitoringLog[] = [
  { id: "audit-1", clinicId: "clinic-vernex", branchId: null, userId: "user-owner-1", actorRole: "owner", eventType: "audit", entityType: "system", entityId: null, action: "phase_13_demo", status: "success", severity: "info", message: "Monitoring fallback active.", metadata: {}, createdAt: new Date().toISOString() },
];
const errors: MonitoringLog[] = [];
const security: MonitoringLog[] = [];
const health: SystemHealthLog[] = [
  { id: "health-1", clinicId: null, branchId: null, userId: null, actorRole: "system", eventType: "health_check", entityType: "frontend", entityId: null, action: "check", status: "ok", severity: "info", message: "Mock health OK.", metadata: {}, createdAt: new Date().toISOString() },
];

function row(input: MonitoringLogInput): MonitoringLog {
  return {
    id: crypto.randomUUID(),
    clinicId: input.clinicId,
    branchId: input.branchId,
    userId: input.userId,
    actorRole: input.actorRole,
    eventType: input.eventType,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    status: input.status ?? "success",
    severity: input.severity ?? "info",
    message: input.message,
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  };
}

export const mockMonitoringService: MonitoringService = {
  logAuditEvent: (input) => mockResolve(void logs.unshift(row(input))),
  logSecurityEvent: (input) => mockResolve(void security.unshift(row({ ...input, eventType: input.eventType || "security_event", severity: input.severity ?? "warning" }))),
  logAppError: (input) => mockResolve(void errors.unshift(row({ ...input, eventType: input.eventType || "app_error", status: input.status ?? "open", severity: input.severity ?? "error" }))),
  logHealthCheck: (input) => mockResolve(void health.unshift(row({ ...input, eventType: input.eventType || "health_check", status: input.status ?? "ok" }) as SystemHealthLog)),
  getAuditLogs: () => mockResolve(logs),
  getSystemHealth: () => mockResolve(health),
  getErrorLogs: () => mockResolve(errors),
  getSecurityEvents: () => mockResolve(security),
};
