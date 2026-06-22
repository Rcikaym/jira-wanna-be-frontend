"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import { BlockedBadge } from "./BlockedBadge"
import { TaskDetailModal } from "./TaskDetailModal"

export function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="relative flex w-full flex-col overflow-hidden rounded-md border border-(--nw-border) bg-(--nw-surface) p-3 text-left transition hover:-translate-y-0.5 hover:border-(--nw-primary) hover:bg-(--nw-primary-light)/45 active:scale-[0.99]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="absolute bottom-0 left-0 top-0 w-px bg-(--nw-border)" />
        <div className="flex w-full flex-col gap-2 pl-1.5">
          {task.status === "BLOCKED" && <BlockedBadge />}
          <p className="text-step-1 font-medium leading-tight text-(--nw-text-primary)">{task.title}</p>
          <time className="font-mono text-[11px] text-(--nw-text-muted)" dateTime={task.updatedAt}>
            {new Date(task.updatedAt).toLocaleDateString()}
          </time>
          {task.assignee && (
            <div className="flex w-full justify-end">
              <div 
                className="flex size-6 items-center justify-center border border-(--nw-border) bg-(--nw-primary-light) text-[10px] font-bold text-(--nw-primary)" 
                title={task.assignee.name}
              >
                {task.assignee.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </button>
      <TaskDetailModal onClose={() => setOpen(false)} open={open} projectId={projectId} task={task} />
    </>
  )
}
