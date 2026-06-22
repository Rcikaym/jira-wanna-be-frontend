import type React from "react"

type Props = {
  children: React.ReactNode
  onReset?: () => void
  hasActiveFilters?: boolean
}

export function FilterBar({ children, onReset, hasActiveFilters }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {children}
      {hasActiveFilters && onReset && (
        <button
          onClick={onReset}
          type="button"
          className="text-xs text-(--nw-primary) underline underline-offset-2 hover:text-(--nw-primary-hover) cursor-pointer transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
