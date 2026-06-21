export type AuditLog = {
  id: string
  user: { id: string; name: string; email?: string } | null
  changedField: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

