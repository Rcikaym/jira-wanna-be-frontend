export const TASK_SEARCHABLE_COLUMNS = ["title"] as const
// description is intentionally excluded — CLIENT_GUEST must not search by it
// and it creates confusing UX to search a field that is not displayed

export const PROJECT_SEARCHABLE_COLUMNS = ["name", "description"] as const
// Both are strings — safe to search together

export const AUDIT_LOG_SEARCHABLE_COLUMNS = ["changedField"] as const
// oldValue and newValue are JSON strings — technically searchable but
// the result is confusing; expose only changedField in the UI

export type TaskSearchColumn = (typeof TASK_SEARCHABLE_COLUMNS)[number]
export type ProjectSearchColumn = (typeof PROJECT_SEARCHABLE_COLUMNS)[number]
export type AuditLogSearchColumn = (typeof AUDIT_LOG_SEARCHABLE_COLUMNS)[number]
