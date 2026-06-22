"use client"

import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Pagination } from "@/components/shared/Pagination"
import { useAuditLog } from "@/hooks/useAuditLog"
import type { EzFilterParams } from "@/types/filters"
import type { AuditLog } from "@/types/audit"

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
    <div className="border border-[var(--nw-border)] bg-[var(--nw-surface)]">
      <div className="space-y-0 p-4 md:p-6">
        {(data?.data ?? []).map((row) => (
          <AuditEntry key={row.id} row={row} />
        ))}
        {!data?.data.length && (
          <p className="py-10 text-center text-[13px] text-[var(--nw-text-muted)]">No changes have been recorded.</p>
        )}
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

function AuditEntry({ row }: { row: AuditLog }) {
  return (
    <article className="relative border-l border-[var(--nw-border)] pb-6 pl-5 last:pb-0">
      <span className="absolute -left-[5px] top-1 size-2.5 rounded-full border border-[var(--nw-border)] bg-[var(--nw-surface)]" />
      <div className="grid gap-2 md:grid-cols-[180px_1fr]">
        <time className="font-mono text-[11px] leading-5 text-[var(--nw-text-muted)]" dateTime={row.createdAt}>
          {new Date(row.createdAt).toLocaleString()}
        </time>
        <div>
          <p className="text-[13px] leading-6 text-[var(--nw-text-primary)]">
            <span className="font-medium">{row.user?.name ?? "System"}</span> changed{" "}
            <span className="font-mono text-[12px]">{row.changedField}</span> from{" "}
            <span className="text-[var(--nw-text-muted)]">{formatValue(row.oldValue)}</span> to{" "}
            <span>{formatValue(row.newValue)}</span>.
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--nw-text-muted)]">{row.user?.id ?? "system"}</p>
        </div>
      </div>
    </article>
  )
}

function formatValue(value: string | null) {
  return value?.trim() ? value : "empty"
}
