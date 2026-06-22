import { Inbox } from "lucide-react"

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-(--nw-border) bg-(--nw-surface)/65 py-16 text-center">
      <Inbox className="h-9 w-9 text-(--nw-text-muted)" aria-hidden="true" />
      <p className="mt-3 text-step-1 text-(--nw-text-muted)">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
