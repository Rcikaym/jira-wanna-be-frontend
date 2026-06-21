import { STATUS_COLORS } from "@/lib/status"
import type { Task, TaskStatus } from "@/types/task"
import { TaskCard } from "./TaskCard"

type Props = {
  status: TaskStatus
  label: string
  tasks: Task[]
  projectId: string
}

export function TaskColumn({ status, label, tasks, projectId }: Props) {
  return (
    <div className="flex min-h-[260px] flex-col rounded-lg border border-[--nw-border] bg-[--nw-background]">
      <div className="rounded-t-lg border-t-4 px-3 py-2" style={{ borderTopColor: STATUS_COLORS[status] }}>
        <span className="font-medium text-[--nw-text-primary]">{label}</span>
        <span className="ml-2 text-sm text-[--nw-text-muted]">{tasks.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} projectId={projectId} task={task} />
        ))}
        {tasks.length === 0 && <p className="p-3 text-sm text-[--nw-text-muted]">No tasks</p>}
      </div>
    </div>
  )
}

