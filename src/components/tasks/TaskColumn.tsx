import type { Task, TaskStatus } from "@/types/task"
import { TaskCard } from "./TaskCard"

type Props = {
  status: TaskStatus
  label: string
  tasks: Task[]
  projectId: string
}

export function TaskColumn({ label, tasks, projectId }: Props) {
  return (
    <div className="flex min-h-80 min-w-65 flex-col border border-(--nw-border) bg-(--nw-surface)/70">
      <div className="border-b border-(--nw-border) px-3 py-3">
        <span className="text-step-1 font-medium text-(--nw-text-primary)">{label}</span>
        <span className="ml-2 font-mono text-step-0 text-(--nw-text-muted)]">{tasks.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} projectId={projectId} task={task} />
        ))}
        {tasks.length === 0 && <p className="p-3 text-step-1 text-(--nw-text-muted)">No tasks in this column.</p>}
      </div>
    </div>
  )
}
