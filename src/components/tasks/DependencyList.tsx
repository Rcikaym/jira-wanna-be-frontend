"use client"

import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { StatusDot } from "@/components/shared/StatusDot"
import { useTaskDependencies } from "@/hooks/useTasks"

export function DependencyList({ taskId }: { taskId: string }) {
  const { data, isLoading } = useTaskDependencies(taskId)

  if (isLoading) return <LoadingSpinner size="sm" />
  if (!data?.length) return <p className="text-sm text-[--nw-text-muted]">No dependencies</p>

  return (
    <ul className="space-y-1">
      {data.map((dep) => (
        <li className="flex flex-wrap items-center gap-2 text-sm" key={dep.id}>
          <StatusDot status={dep.dependsOnTask.status} />
          <span className="text-[--nw-text-primary]">{dep.dependsOnTask.title}</span>
          <StatusBadge size="xs" status={dep.dependsOnTask.status} />
          {dep.dependsOnTask.status !== "DONE" && <span className="text-xs text-[--nw-blocked]">Blocking</span>}
        </li>
      ))}
    </ul>
  )
}

