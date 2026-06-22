import { Search, X } from "lucide-react"
import { type ChangeEvent, useEffect, useState  } from "react"
import { useDebouncedCallback } from "use-debounce"

type Props = {
  placeholder?: string
  debounceMs?: number
  onSearch: (term: string) => void
  defaultValue?: string
}

export function SearchInput({ placeholder = "Search", debounceMs = 350, onSearch, defaultValue = "" }: Props) {
  const [value, setValue] = useState(defaultValue)

  // Sync value if defaultValue changes (e.g. on reset)
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term.trim())
  }, debounceMs)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleClear = () => {
    setValue("")
    debouncedSearch.cancel()
    onSearch("")
  }

  return (
    <div className="relative flex items-center w-full">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-(--nw-text-muted)" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-(--nw-border) bg-(--nw-surface) pl-9 pr-8 text-step-1 text-(--nw-text-primary) outline-none transition focus:border-(--nw-primary)"
      />
      {value && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-3 text-(--nw-text-muted) hover:text-(--nw-text-primary) cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
