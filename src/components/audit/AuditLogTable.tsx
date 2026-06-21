"use client"

import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Pagination } from "@/components/shared/Pagination"
import { useAuditLog } from "@/hooks/useAuditLog"
import type { EzFilterParams } from "@/lib/serialiseFilters"

export function AuditLogTable({
  projectId,
  params,
  onPageChange,
  onRowsChange,
}: {
  projectId: string
  params: EzFilterParams
  onPageChange: (page: number) => void
  onRowsChange: (rows: number) => void
}) {
  const { data, isError, isLoading, refetch } = useAuditLog(projectId, params)

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="Failed to load audit log" onRetry={() => void refetch()} />

  return (
    <div className="overflow-hidden rounded-lg border border-[--nw-border] bg-[--nw-surface]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[--nw-background] text-[--nw-text-secondary]">
            <tr>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Field</th>
              <th className="px-4 py-3">Old value</th>
              <th className="px-4 py-3">New value</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((row) => (
              <tr className="border-t border-[--nw-border]" key={row.id}>
                <td className="px-4 py-3">{row.user?.name ?? "System"}</td>
                <td className="px-4 py-3">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{row.changedField}</td>
                <td className="px-4 py-3 text-[--nw-text-muted]">{row.oldValue ?? "-"}</td>
                <td className="px-4 py-3 text-[--nw-text-primary]">{row.newValue ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <Pagination
          onPageChange={onPageChange}
          onRowsChange={onRowsChange}
          page={params.page ?? 1}
          rows={params.rows ?? 10}
          total={data?.meta.total ?? 0}
        />
      </div>
    </div>
  )
}

