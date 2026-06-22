"use client"

import { useParams } from "next/navigation"
import { AuditLogTable } from "@/components/audit/AuditLogTable"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { FilterBar } from "@/components/shared/FilterBar"
import { useQueryParams } from "@/hooks/useQueryParams"

export default function AuditLogPage() {
  const { projectId } = useParams<{ projectId: string }>()

  const {
    params: queryParams,
    setFilter,
    clearFilter,
    setRangedFilter,
    clearRangedFilter,
    setPage,
    setRows,
    resetAll,
  } = useQueryParams({
    defaultRows: 10,
    defaultOrderKey: "createdAt",
    defaultOrderRule: "desc",
  })

  // Extract start and end dates for input display
  const createdAtRange = queryParams.rangedFilters?.find((f) => f.key === "createdAt")
  const startDate = createdAtRange?.start ? (createdAtRange.start as string).split("T")[0] : ""
  const endDate = createdAtRange?.end ? (createdAtRange.end as string).split("T")[0] : ""

  const hasActiveFilters = !!(
    queryParams.filters?.changedField ||
    queryParams.filters?.userId ||
    createdAtRange
  )

  return (
    <RoleGuard allow={["PM"]}>
      <div className="space-y-6">
        <div className="border-l border-(--nw-primary) pl-4">
          <h1 className="text-2xl font-semibold text-(--nw-text-primary)">Audit log</h1>
          <p className="mt-2 max-w-xl text-step-1 leading-6 text-(--nw-text-secondary)">
            Project changes in newest-first order, written as a system record.
          </p>
        </div>

        <FilterBar hasActiveFilters={hasActiveFilters} onReset={resetAll}>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="h-10 rounded-md border border-(--nw-border) px-3 text-step-1 outline-none focus:border-(--nw-primary) bg-(--nw-surface) text-(--nw-text-primary)"
              onChange={(event) =>
                event.target.value
                  ? setFilter("changedField", event.target.value)
                  : clearFilter("changedField")
              }
              value={(queryParams.filters?.changedField as string) ?? ""}
            >
              <option value="">All fields</option>
              <option value="status">status</option>
              <option value="description">description</option>
              <option value="assigneeId">assigneeId</option>
              <option value="attachment">attachment</option>
            </select>

            <input
              className="h-10 rounded-md border border-(--nw-border) px-3 font-mono text-step-0 outline-none focus:border-(--nw-primary) bg-(--nw-surface) text-(--nw-text-primary)"
              onChange={(event) =>
                event.target.value
                  ? setFilter("userId", event.target.value)
                  : clearFilter("userId")
              }
              placeholder="Exact userId"
              value={(queryParams.filters?.userId as string) ?? ""}
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-(--nw-text-secondary)">From</span>
              <input
                className="h-10 rounded-md border border-(--nw-border) px-3 font-mono text-step-0 outline-none focus:border-(--nw-primary) bg-(--nw-surface) text-(--nw-text-primary)"
                onChange={(e) => {
                  if (e.target.value) {
                    setRangedFilter({
                      key: "createdAt",
                      start: `${e.target.value}T00:00:00.000Z`,
                      end: createdAtRange?.end ?? `${e.target.value}T23:59:59.999Z`,
                    })
                  }
                }}
                type="date"
                value={startDate}
              />

              <span className="text-sm text-(--nw-text-secondary)">To</span>
              <input
                className="h-10 rounded-md border border-(--nw-border) px-3 font-mono text-step-0 outline-none focus:border-(--nw-primary) bg-(--nw-surface) text-(--nw-text-primary)"
                onChange={(e) => {
                  if (e.target.value) {
                    setRangedFilter({
                      key: "createdAt",
                      start: createdAtRange?.start ?? `${e.target.value}T00:00:00.000Z`,
                      end: `${e.target.value}T23:59:59.999Z`,
                    })
                  }
                }}
                type="date"
                value={endDate}
              />

              {createdAtRange && (
                <button
                  onClick={() => clearRangedFilter("createdAt")}
                  type="button"
                  className="text-xs text-(--nw-primary) underline cursor-pointer hover:text-(--nw-primary-hover)"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>
        </FilterBar>

        <AuditLogTable
          onPageChange={setPage}
          onRowsChange={setRows}
          params={queryParams}
          projectId={projectId}
        />
      </div>
    </RoleGuard>
  )
}
