type Props = {
  total: number
  page: number
  rows: number
  onPageChange: (page: number) => void
  onRowsChange: (rows: number) => void
}

export function Pagination({ total, page, rows, onPageChange, onRowsChange }: Props) {
  const start = total === 0 ? 0 : (page - 1) * rows + 1
  const end = Math.min(page * rows, total)
  const hasPrevious = page > 1
  const hasNext = end < total

  return (
    <div className="flex flex-col gap-3 border-t border-[--nw-border] pt-4 text-sm text-[--nw-text-secondary] sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start}-{end} of {total} results
      </span>
      <div className="flex items-center gap-2">
        <select
          className="h-9 rounded-md border border-[--nw-border] bg-[--nw-surface] px-2"
          onChange={(event) => onRowsChange(Number(event.target.value))}
          value={rows}
        >
          {[10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          className="h-9 rounded-md border border-[--nw-border] px-3 disabled:opacity-40"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          Previous
        </button>
        <button
          className="h-9 rounded-md border border-[--nw-border] px-3 disabled:opacity-40"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  )
}

