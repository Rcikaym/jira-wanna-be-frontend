"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { FilterBar } from "@/components/shared/FilterBar"
import { Pagination } from "@/components/shared/Pagination"
import { SearchInput } from "@/components/shared/SearchInput"
import { SortControl } from "@/components/shared/SortControl"
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal"
import { TaskBoard } from "@/components/tasks/TaskBoard"
import { useQueryParams } from "@/hooks/useQueryParams"
import { useTaskList } from "@/hooks/useTasks"

export default function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  
  const {
    params: queryParams,
    setFilter,
    clearFilter,
    setSearch,
    clearSearch,
    setPage,
    setRows,
    setSort,
    resetAll,
  } = useQueryParams({
    defaultRows: 50,
    defaultOrderKey: "createdAt",
    defaultOrderRule: "desc",
  })

  const { data, isLoading, isError, refetch } = useTaskList(projectId, queryParams)

  return (
    <RoleGuard allow={["PM", "INTERNAL"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-(--nw-border) pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="border-l border-(--nw-primary) pl-4">
            <h1 className="text-2xl font-semibold text-(--nw-text-primary)">Task board</h1>
            <p className="mt-2 max-w-xl text-step-1 leading-6 text-(--nw-text-secondary)">
              Move work by status, review dependencies, and keep client-visible tasks deliberate.
            </p>
            <RoleGuard allow={["PM"]} fallback={null}>
              <Link className="mt-2 inline-block text-step-1 font-medium text-(--nw-primary) underline-offset-4 hover:underline" href={`/projects/${projectId}/audit-log`}>
                Audit log
              </Link>
            </RoleGuard>
          </div>
          <RoleGuard allow={["PM"]} fallback={null}>
            <CreateTaskModal projectId={projectId} />
          </RoleGuard>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <SearchInput
                placeholder="Search tasks..."
                onSearch={(term) => (term ? setSearch({ title: term }) : clearSearch())}
                defaultValue={queryParams.searchFilters?.title as string ?? ""}
              />
            </div>
            <SortControl
              columns={[
                { key: "createdAt", label: "Created" },
                { key: "updatedAt", label: "Updated" },
                { key: "title", label: "Title" },
              ]}
              current={{ key: queryParams.orderKey, rule: queryParams.orderRule }}
              onChange={setSort}
            />
          </div>

          <FilterBar
            hasActiveFilters={!!(queryParams.filters?.status || queryParams.filters?.["assignee.department"] || queryParams.searchFilters)}
            onReset={resetAll}
          >
            {/* Status filter — uses exact filters */}
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

            {/* Department filter (PM task board only) — uses exact filters */}
            <RoleGuard allow={["PM"]} fallback={null}>
              <select
                value={(queryParams.filters?.["assignee.department"] as string) ?? ""}
                onChange={(e) =>
                  e.target.value
                    ? setFilter("assignee.department", e.target.value)
                    : clearFilter("assignee.department")
                }
                className="h-10 rounded-md border border-(--nw-border) px-3 text-step-1 text-(--nw-text-primary) bg-(--nw-surface) outline-none transition focus:border-(--nw-primary)"
              >
                <option value="">All departments</option>
                <option value="UI_UX">UI/UX</option>
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
              </select>
            </RoleGuard>
          </FilterBar>
        </div>

        <TaskBoard
          projectId={projectId}
          tasks={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
        />

        <Pagination
          total={data?.meta.total ?? 0}
          page={queryParams.page ?? 1}
          rows={queryParams.rows ?? 50}
          onPageChange={setPage}
          onRowsChange={setRows}
        />
      </div>
    </RoleGuard>
  )
}
