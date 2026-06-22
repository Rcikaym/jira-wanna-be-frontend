import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type React from "react"

type Props = {
  total: number
  page: number
  rows: number
  onPageChange: (page: number) => void
  onRowsChange: (rows: number) => void
}

const ROWS_OPTIONS = [10, 25, 50] as const

export function Pagination({ total, page, rows, onPageChange, onRowsChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / rows))
  const from = total === 0 ? 0 : (page - 1) * rows + 1
  const to = Math.min(page * rows, total)

  const handlePageChange = (targetPage: number) => {
    const validPage = Math.max(1, Math.min(targetPage, totalPages))
    if (validPage !== page) {
      onPageChange(validPage)
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-(--nw-border) pt-4 text-step-1 text-(--nw-text-secondary) sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono text-step-0">
        {total === 0 ? "No results" : `Showing ${from}–${to} of ${total} results`}
      </span>
      <div className="flex items-center gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-step-1 text-(--nw-text-secondary)">Rows</span>
          <select
            value={rows}
            onChange={(e) => onRowsChange(Number(e.target.value))}
            className="h-9 rounded-md border border-(--nw-border) px-2 font-mono text-step-0 bg-(--nw-surface) text-(--nw-text-primary) focus:outline-none focus:border-(--nw-primary)"
          >
            {ROWS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <PageButton
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            label="First"
          >
            <ChevronsLeft className="h-4 w-4" />
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
          <span className="px-3 text-step-1 font-mono text-(--nw-text-primary)">
            {page} / {totalPages}
          </span>
          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(totalPages)}
            disabled={page >= totalPages}
            label="Last"
          >
            <ChevronsRight className="h-4 w-4" />
          </PageButton>
        </div>
      </div>
    </div>
  )
}

function PageButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      type="button"
      className="h-9 w-9 flex items-center justify-center rounded-md border border-(--nw-border) bg-(--nw-surface)
                 text-step-1 text-(--nw-text-primary) disabled:opacity-40 disabled:cursor-not-allowed
                 hover:bg-(--nw-primary-light) hover:border-(--nw-primary) transition cursor-pointer"
    >
      {children}
    </button>
  )
}
