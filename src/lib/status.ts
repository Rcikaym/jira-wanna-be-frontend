import type { TaskStatus } from "@/types/task"

export const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  BLOCKED: "Blocked",
}

