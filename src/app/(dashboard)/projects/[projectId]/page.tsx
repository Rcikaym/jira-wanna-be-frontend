"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { FilterBar } from "@/components/shared/FilterBar"
import { SearchInput } from "@/components/shared/SearchInput"
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal"
import { TaskBoard } from "@/components/tasks/TaskBoard"
import type { EzFilterParams } from "@/lib/serialiseFilters"
import type { TaskStatus } from "@/types/task"

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>()
  const projectId = params.projectId
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TaskStatus | "">("")
  const queryParams: EzFilterParams = useMemo(
    () => ({
      page: 1,
      rows: 50,
      filters: status ? { status } : undefined,
      searchFilters: search ? { title: search } : undefined,
    }),
    [search, status]
  )

  return (
    <RoleGuard allow={["PM", "INTERNAL"]}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[--nw-text-primary]">Task board</h1>
            <RoleGuard allow={["PM"]} fallback={null}>
              <Link className="mt-1 inline-block text-sm text-[--nw-primary]" href={`/projects/${projectId}/audit-log`}>
                Audit log
              </Link>
            </RoleGuard>
          </div>
          <RoleGuard allow={["PM"]} fallback={null}>
            <CreateTaskModal projectId={projectId} />
          </RoleGuard>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchInput onChange={setSearch} placeholder="Search tasks" value={search} />
          <FilterBar onStatusChange={setStatus} status={status} />
        </div>
        <TaskBoard params={queryParams} projectId={projectId} />
      </div>
    </RoleGuard>
  )
}

