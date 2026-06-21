"use client"

import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { AuditLogTable } from "@/components/audit/AuditLogTable"
import { RoleGuard } from "@/components/layout/RoleGuard"
import type { EzFilterParams } from "@/lib/serialiseFilters"

export default function AuditLogPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [changedField, setChangedField] = useState("")
  const [userId, setUserId] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const params: EzFilterParams = useMemo(
    () => ({
      page,
      rows,
      orderKey: "createdAt",
      orderRule: "desc",
      filters: {
        ...(changedField ? { changedField } : {}),
        ...(userId ? { userId } : {}),
      },
      rangedFilters: start || end ? [{ key: "createdAt", start: start || undefined, end: end || undefined }] : undefined,
    }),
    [changedField, end, page, rows, start, userId]
  )

  return (
    <RoleGuard allow={["PM"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-[--nw-text-primary]">Audit log</h1>
          <p className="mt-1 text-sm text-[--nw-text-secondary]">Project changes in newest-first order.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <select className="h-10 rounded-md border border-[--nw-border] px-3 text-sm" onChange={(event) => setChangedField(event.target.value)} value={changedField}>
            <option value="">All fields</option>
            <option value="status">status</option>
            <option value="description">description</option>
            <option value="assigneeId">assigneeId</option>
            <option value="attachment">attachment</option>
          </select>
          <input className="h-10 rounded-md border border-[--nw-border] px-3 text-sm" onChange={(event) => setUserId(event.target.value)} placeholder="Exact userId" value={userId} />
          <input className="h-10 rounded-md border border-[--nw-border] px-3 text-sm" onChange={(event) => setStart(event.target.value)} type="date" value={start} />
          <input className="h-10 rounded-md border border-[--nw-border] px-3 text-sm" onChange={(event) => setEnd(event.target.value)} type="date" value={end} />
        </div>
        <AuditLogTable
          onPageChange={setPage}
          onRowsChange={(value) => {
            setRows(value)
            setPage(1)
          }}
          params={params}
          projectId={projectId}
        />
      </div>
    </RoleGuard>
  )
}

