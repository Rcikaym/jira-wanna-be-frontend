"use client"

import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { ClientTaskCard } from "@/components/client/ClientTaskCard"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { FilterBar } from "@/components/shared/FilterBar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Pagination } from "@/components/shared/Pagination"
import { SearchInput } from "@/components/shared/SearchInput"
import { useClientTasks } from "@/hooks/useClientView"
import type { EzFilterParams } from "@/lib/serialiseFilters"
import type { TaskStatus } from "@/types/task"

export default function ClientProjectTasksPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TaskStatus | "">("")
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const params: EzFilterParams = useMemo(
    () => ({
      page,
      rows,
      filters: status ? { status } : undefined,
      searchFilters: search ? { title: search } : undefined,
    }),
    [page, rows, search, status]
  )
  const { data, isError, isLoading, refetch } = useClientTasks(projectId, params)

  return (
    <RoleGuard allow={["CLIENT_GUEST"]}>
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-[--nw-text-primary]">Visible tasks</h1>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchInput
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search visible tasks"
            value={search}
          />
          <FilterBar onStatusChange={setStatus} status={status} />
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorState message="Failed to load visible tasks" onRetry={() => void refetch()} />
        ) : !data?.data.length ? (
          <EmptyState message="No visible tasks found" />
        ) : (
          <div className="space-y-3">
            {data.data.map((task) => (
              <ClientTaskCard key={task.id} task={task} />
            ))}
            <Pagination
              onPageChange={setPage}
              onRowsChange={(value) => {
                setRows(value)
                setPage(1)
              }}
              page={page}
              rows={rows}
              total={data.meta.total}
            />
          </div>
        )}
      </div>
    </RoleGuard>
  )
}

