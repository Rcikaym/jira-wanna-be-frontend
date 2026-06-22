"use client"

import { useParams } from "next/navigation"
import { ClientTaskCard } from "@/components/client/ClientTaskCard"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { FilterBar } from "@/components/shared/FilterBar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Pagination } from "@/components/shared/Pagination"
import { SearchInput } from "@/components/shared/SearchInput"
import { useClientTasks } from "@/hooks/useClientView"
import { useQueryParams } from "@/hooks/useQueryParams"

export default function ClientProjectTasksPage() {
  const { projectId } = useParams<{ projectId: string }>()

  const {
    params: queryParams,
    setFilter,
    clearFilter,
    setSearch,
    clearSearch,
    setPage,
    setRows,
    resetAll,
  } = useQueryParams({
    defaultRows: 10,
    defaultOrderKey: "createdAt",
    defaultOrderRule: "desc",
  })

  const { data, isError, isLoading, refetch } = useClientTasks(projectId, queryParams)

  const hasActiveFilters = !!(queryParams.filters?.status || queryParams.searchFilters)

  return (
    <RoleGuard allow={["CLIENT_GUEST"]}>
      <div className="space-y-6">
        <div className="border-l border-(--nw-primary) pl-4">
          <h1 className="text-2xl font-semibold text-(--nw-text-primary)">Visible tasks</h1>
          <p className="mt-2 max-w-xl text-step-1 leading-6 text-(--nw-text-secondary)">
            This board shows task titles, status, and update dates. Internal notes, assignments, dependencies, and audit history stay hidden.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full">
            <SearchInput
              placeholder="Search visible tasks"
              onSearch={(value) => {
                if (value) {
                  setSearch({ title: value })
                } else {
                  clearSearch()
                }
              }}
              defaultValue={queryParams.searchFilters?.title as string ?? ""}
            />
          </div>

          <FilterBar hasActiveFilters={hasActiveFilters} onReset={resetAll}>
            <select
              value={(queryParams.filters?.status as string) ?? ""}
              onChange={(e) =>
                e.target.value ? setFilter("status", e.target.value) : clearFilter("status")
              }
              className="h-10 rounded-md border border-(--nw-border) px-3 text-step-1 text-(--nw-text-primary) bg-(--nw-surface) outline-none transition focus:border-(--nw-primary)"
            >
              <option value="">All statuses</option>
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DONE">Done</option>
            </select>
          </FilterBar>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorState message="Failed to load visible tasks" onRetry={() => void refetch()} />
        ) : !data?.data.length ? (
          <EmptyState message="No visible tasks match this view." />
        ) : (
          <div className="space-y-3">
            {data.data.map((task) => (
              <ClientTaskCard key={task.id} task={task} />
            ))}
            <Pagination
              onPageChange={setPage}
              onRowsChange={setRows}
              page={queryParams.page ?? 1}
              rows={queryParams.rows ?? 10}
              total={data.meta.total}
            />
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
