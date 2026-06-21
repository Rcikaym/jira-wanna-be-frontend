"use client"

import { useMemo, useState } from "react"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useTaskList } from "@/hooks/useTasks"
import type { EzFilterParams } from "@/lib/serialiseFilters"
import type { Task, TaskStatus } from "@/types/task"
import { TaskColumn } from "./TaskColumn"

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "BLOCKED", label: "Blocked" },
  { status: "DONE", label: "Done" },
]

export function TaskBoard({
  projectId,
  params,
}: {
  projectId: string
  params?: EzFilterParams
}) {
  const [baseParams] = useState<EzFilterParams>({ page: 1, rows: 50 })
  const queryParams = params ?? baseParams
  const { data, isError, isLoading, refetch } = useTaskList(projectId, queryParams)
  const tasks = data?.data ?? []
  const tasksByStatus = useMemo(
    () =>
      tasks.reduce<Record<TaskStatus, Task[]>>(
        (acc, task) => {
          acc[task.status].push(task)
          return acc
        },
        { BACKLOG: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] }
      ),
    [tasks]
  )

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="Failed to load tasks" onRetry={() => void refetch()} />
  if (!tasks.length) return <EmptyState message="No tasks yet" />

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {COLUMNS.map((col) => (
        <TaskColumn
          key={col.status}
          label={col.label}
          projectId={projectId}
          status={col.status}
          tasks={tasksByStatus[col.status]}
        />
      ))}
    </div>
  )
}
