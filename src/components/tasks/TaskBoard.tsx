"use client"

import { useMemo } from "react"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
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
  tasks,
  isLoading,
  isError,
  refetch,
}: {
  projectId: string
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}) {
  const tasksByStatus = useMemo(
    () =>
      tasks.reduce<Record<TaskStatus, Task[]>>(
        (acc, task) => {
          if (acc[task.status]) {
            acc[task.status].push(task)
          }
          return acc
        },
        { BACKLOG: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] }
      ),
    [tasks]
  )

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="Failed to load tasks" onRetry={() => void refetch()} />
  if (!tasks.length) return <EmptyState message="No tasks match this board view." />

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-4 md:overflow-visible">
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
