import { TriangleAlert } from "lucide-react"

export function BlockedBadge() {
  return (
    <div className="mb-2 flex items-center gap-1">
      <TriangleAlert className="h-3.5 w-3.5 text-(--nw-blocked)" aria-hidden="true" />
      <span className="text-xs font-medium text-(--nw-blocked)">Waiting on dependencies</span>
    </div>
  )
}

