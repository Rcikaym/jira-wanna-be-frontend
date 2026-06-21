import { STATUS_COLORS } from "@/lib/status"
import type { TaskStatus } from "@/types/task"

export function StatusDot({ status }: { status: TaskStatus }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    />
  )
}

