"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import type { Task } from "@/types/task"
import { BlockedBadge } from "./BlockedBadge"
import { TaskDetailModal } from "./TaskDetailModal"

export function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="rounded-md border border-[--nw-border] bg-[--nw-surface] p-3 text-left transition-all hover:border-[--nw-primary] hover:shadow-sm"
        onClick={() => setOpen(true)}
        type="button"
      >
        {task.status === "BLOCKED" && <BlockedBadge />}
        <p className="text-sm font-medium text-[--nw-text-primary]">{task.title}</p>
        {task.assignee && <p className="mt-1 text-xs text-[--nw-text-muted]">{task.assignee.name}</p>}
        <StatusBadge className="mt-2" status={task.status} />
      </button>
      <TaskDetailModal onClose={() => setOpen(false)} open={open} projectId={projectId} task={task} />
    </>
  )
}

