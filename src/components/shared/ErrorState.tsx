import { TriangleAlert } from "lucide-react"

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-(--nw-border) bg-(--nw-surface)/65 py-16 text-center">
      <TriangleAlert className="h-10 w-10 text-(--nw-danger)" aria-hidden="true" />
      <p className="mt-3 text-step-1 text-(--nw-danger)">{message}</p>
      {onRetry && (
        <button className="mt-4 text-step-1 font-medium text-(--nw-primary) underline-offset-4 hover:underline" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  )
}
