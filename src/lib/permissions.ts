import type { AuthUser } from "@/types/auth"
import type { Task, TaskStatus } from "@/types/task"

export type TaskAction = {
  label: string
  nextStatus: TaskStatus
  disabled: boolean
  reason?: string
}

export function computeAvailableActions(
  user: AuthUser | null,
  task: Task,
  allDepsDone: boolean
): TaskAction[] {
  if (!user || user.role === "CLIENT_GUEST") return []

  const actions: TaskAction[] = []

  if (user.role === "PM") {
    if (task.status !== "IN_PROGRESS") {
      actions.push({ label: "Start", nextStatus: "IN_PROGRESS", disabled: false })
    }
    if (task.status !== "BACKLOG") {
      actions.push({ label: "Reset to Backlog", nextStatus: "BACKLOG", disabled: false })
    }
    if (task.status !== "BLOCKED") {
      actions.push({ label: "Mark Blocked", nextStatus: "BLOCKED", disabled: false })
    }
    actions.push({
      label: "Mark Done",
      nextStatus: "DONE",
      disabled: true,
      reason: "Only the assigned engineer can mark a task as done",
    })
  }

  if (user.role === "INTERNAL") {
    if (task.status !== "IN_PROGRESS") {
      actions.push({
        label: "Start",
        nextStatus: "IN_PROGRESS",
        disabled: !allDepsDone,
        reason: !allDepsDone ? "All dependencies must be done before starting this task" : undefined,
      })
    }
    if (task.status === "IN_PROGRESS") {
      const isAssignee = task.assignee?.id === user.id
      actions.push({
        label: "Mark Done",
        nextStatus: "DONE",
        disabled: !isAssignee,
        reason: !isAssignee ? "Only the assigned engineer can complete this task" : undefined,
      })
    }
  }

  return actions
}

