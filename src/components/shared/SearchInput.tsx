import { Search } from "lucide-react"

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[--nw-text-muted]" />
      <input
        className="h-10 w-full rounded-md border border-[--nw-border] bg-[--nw-surface] pl-9 pr-3 text-sm text-[--nw-text-primary] outline-none focus:border-[--nw-primary]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  )
}

