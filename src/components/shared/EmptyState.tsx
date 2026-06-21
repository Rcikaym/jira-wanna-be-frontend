import { Inbox } from "lucide-react"

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-10 w-10 text-[--nw-text-muted]" aria-hidden="true" />
      <p className="mt-3 text-sm text-[--nw-text-muted]">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

