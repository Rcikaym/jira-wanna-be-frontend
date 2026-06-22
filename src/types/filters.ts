export type OrderRule = "asc" | "desc"

export type RangedFilter = {
  key: string
  start: unknown
  end: unknown
}

// The full set of 7 params. All optional.
export type EzFilterParams = {
  filters?: Record<string, unknown>
  searchFilters?: Record<string, unknown>
  rangedFilters?: RangedFilter[]
  page?: number
  rows?: number
  orderKey?: string
  orderRule?: OrderRule
}

// What Axios actually sends in the query string — all values are strings
export type SerialisedParams = Record<string, string>
