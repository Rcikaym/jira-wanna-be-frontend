import type { TaskStatus } from "@/types/task"

export function FilterBar({
  status,
  onStatusChange,
}: {
  status: TaskStatus | ""
  onStatusChange: (status: TaskStatus | "") => void
}) {
  return (
    <select
      className="h-10 rounded-md border border-[--nw-border] bg-[--nw-surface] px-3 text-sm text-[--nw-text-primary]"
      onChange={(event) => onStatusChange(event.target.value as TaskStatus | "")}
      value={status}
    >
      <option value="">All statuses</option>
      <option value="BACKLOG">Backlog</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="BLOCKED">Blocked</option>
      <option value="DONE">Done</option>
    </select>
  )
}

