import { TriangleAlert } from "lucide-react"

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TriangleAlert className="h-10 w-10 text-[--nw-danger]" aria-hidden="true" />
      <p className="mt-3 text-sm text-[--nw-danger]">{message}</p>
      {onRetry && (
        <button className="mt-4 text-sm text-[--nw-primary] underline" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  )
}

