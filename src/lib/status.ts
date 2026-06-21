import type { TaskStatus } from "@/types/task"

export const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  BLOCKED: "Blocked",
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "var(--nw-backlog)",
  IN_PROGRESS: "var(--nw-in-progress)",
  DONE: "var(--nw-success)",
  BLOCKED: "var(--nw-blocked)",
}

