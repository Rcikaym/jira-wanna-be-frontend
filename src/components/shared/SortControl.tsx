import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OrderRule } from "@/types/filters"

type SortColumn = {
  key: string
  label: string
}

type Props = {
  columns: SortColumn[]
  current: { key?: string; rule?: OrderRule }
  onChange: (key: string, rule: OrderRule) => void
}

export function SortControl({ columns, current, onChange }: Props) {
  const handleClick = (key: string) => {
    if (current.key === key) {
      // Toggle direction if same column
      onChange(key, current.rule === "asc" ? "desc" : "asc")
    } else {
      // New column — default to desc
      onChange(key, "desc")
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-(--nw-text-muted) mr-1">Sort:</span>
      {columns.map((col) => {
        const isActive = current.key === col.key
        return (
          <button
            key={col.key}
            type="button"
            onClick={() => handleClick(col.key)}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors cursor-pointer",
              isActive
                ? "bg-(--nw-primary-light) text-(--nw-primary) font-medium"
                : "text-(--nw-text-muted) hover:bg-(--nw-background)"
            )}
          >
            {col.label}
            {isActive && (
              <ChevronDown
                className={cn("h-3 w-3 transition-transform", current.rule === "asc" && "rotate-180")}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
