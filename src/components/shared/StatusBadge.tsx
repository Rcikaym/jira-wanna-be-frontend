import { cn } from "@/lib/utils"
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/status"
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
        "inline-flex w-fit items-center rounded-full border px-2 font-medium",
        size === "xs" ? "py-0.5 text-[11px]" : "py-1 text-xs",
        className
      )}
      style={{
        borderColor: STATUS_COLORS[status],
        color: STATUS_COLORS[status],
        backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

