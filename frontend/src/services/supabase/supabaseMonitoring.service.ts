import { supabase } from "../../lib/supabaseClient";
import { mockMonitoringService } from "../mock/mockMonitoring.service";
import type { MonitoringFilters, MonitoringLog, MonitoringLogInput, MonitoringService, SystemHealthLog } from "../interfaces";
import { supabaseAuthService } from "./supabaseAuth.service";

type AnyRow = Record<string, any>;
const db = supabase as unknown as { from: (table: string) => any };

function isUuid(value?: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function mapLog(row: AnyRow): MonitoringLog {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    branchId: row.branch_id,
    userId: row.user_id ?? row.actor_id,
    actorRole: row.actor_role,
    eventType: row.event_type ?? "audit",
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    status: row.status,
    severity: row.severity,
    message: row.message,
    metadata: row.metadata ?? {},
    createdAt: row.created_at ?? "",
  };
}

async function context(input: MonitoringLogInput) {
  const auth = await supabaseAuthService.getCurrentAuthContext().catch(() => null);
  return {
    clinicId: input.clinicId ?? auth?.clinic_id ?? null,
    branchId: input.branchId ?? auth?.branch_id ?? null,
    userId: input.userId ?? auth?.staffProfileId ?? null,
    actorRole: input.actorRole ?? auth?.role_key ?? null,
  };
}

function payload(input: MonitoringLogInput, scoped: Awaited<ReturnType<typeof context>>) {
  return {
    clinic_id: scoped.clinicId,
    branch_id: scoped.branchId,
    actor_id: scoped.userId,
    user_id: scoped.userId,
    actor_role: scoped.actorRole,
    event_type: input.eventType,
    entity_type: input.entityType ?? null,
    entity_id: isUuid(input.entityId) ? input.entityId : null,
    action: input.action ?? input.eventType,
    status: input.status ?? "success",
    severity: input.severity ?? "info",
    message: input.message ?? null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    metadata: input.metadata ?? {},
  };
}

function applyFilters(query: any, filters?: MonitoringFilters) {
  let next = query;
  if (filters?.clinicId) next = next.eq("clinic_id", filters.clinicId);
  if (filters?.dateFrom) next = next.gte("created_at", `${filters.dateFrom}T00:00:00`);
  if (filters?.dateTo) next = next.lte("created_at", `${filters.dateTo}T23:59:59`);
  if (filters?.status && filters.status !== "all") next = next.eq("status", filters.status);
  if (filters?.severity) next = next.eq("severity", filters.severity);
  if (filters?.module && filters.module !== "all") next = next.eq("entity_type", filters.module);
  return next.order("created_at", { ascending: false }).limit(filters?.limit ?? 50);
}

async function insert(table: string, input: MonitoringLogInput) {
  const scoped = await context(input);
  const { error } = await db.from(table).insert(payload(input, scoped));
  if (error) throw error;
}

async function select(table: string, filters?: MonitoringFilters) {
  const { data, error } = await applyFilters(db.from(table).select("*"), filters);
  if (error) throw error;
  return (data ?? []).map(mapLog);
}

function fallback<T>(operation: () => Promise<T>, backup: () => Promise<T>) {
  return operation().catch(() => backup());
}

export const supabaseMonitoringService: MonitoringService = {
  logAuditEvent(input) {
    return fallback(() => insert("audit_logs", input), () => mockMonitoringService.logAuditEvent(input));
  },
  logSecurityEvent(input) {
    return fallback(() => insert("security_events", { ...input, eventType: input.eventType || "security_event", severity: input.severity ?? "warning", status: input.status ?? "recorded" }), () => mockMonitoringService.logSecurityEvent(input));
  },
  logAppError(input) {
    return fallback(() => insert("app_error_logs", { ...input, eventType: input.eventType || "app_error", severity: input.severity ?? "error", status: input.status ?? "open" }), () => mockMonitoringService.logAppError(input));
  },
  logHealthCheck(input) {
    return fallback(() => insert("system_health_checks", { ...input, eventType: input.eventType || "health_check", status: input.status ?? "ok" }), () => mockMonitoringService.logHealthCheck(input));
  },
  getAuditLogs(filters) {
    return fallback(() => select("audit_logs", filters), () => mockMonitoringService.getAuditLogs(filters));
  },
  getSystemHealth(filters) {
    return fallback(() => select("system_health_checks", filters) as Promise<SystemHealthLog[]>, () => mockMonitoringService.getSystemHealth(filters));
  },
  getErrorLogs(filters) {
    return fallback(() => select("app_error_logs", filters), () => mockMonitoringService.getErrorLogs(filters));
  },
  getSecurityEvents(filters) {
    return fallback(() => select("security_events", filters), () => mockMonitoringService.getSecurityEvents(filters));
  },
};
