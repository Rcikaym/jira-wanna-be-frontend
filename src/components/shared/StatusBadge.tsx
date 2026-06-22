import { STATUS_LABELS } from "@/lib/status"
import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/types/task"

export function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: TaskStatus
  size?: "xs" | "sm"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border-l border-(--nw-border) pl-2 font-medium text-(--nw-text-primary)",
        size === "xs" ? "text-[11px]" : "text-xs",
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
