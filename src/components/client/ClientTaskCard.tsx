import { StatusBadge } from "@/components/shared/StatusBadge"
import type { ClientTask } from "@/types/task"

export function ClientTaskCard({ task }: { task: ClientTask }) {
  return (
    <div className="rounded-lg border border-[--nw-border] bg-[--nw-surface] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[--nw-text-primary]">{task.title}</h3>
          <p className="mt-1 text-sm text-[--nw-text-muted]">{new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>
    </div>
  )
}

