import type { TaskStatus } from "@/types/task"

export function StatusDot({ status }: { status: TaskStatus }) {
  return <span aria-hidden="true" className="inline-block h-4 border-l border-(--nw-border)" title={status} />
}
