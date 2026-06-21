export type EzFilterParams = {
  filters?: Record<string, unknown>
  searchFilters?: Record<string, unknown>
  rangedFilters?: Array<{ key: string; start: unknown; end: unknown }>
  page?: number
  rows?: number
  orderKey?: string
  orderRule?: "asc" | "desc"
}

export function serialiseFilters(params: EzFilterParams): Record<string, string> {
  const out: Record<string, string> = {}

  if (params.filters) out.filters = JSON.stringify(params.filters)
  if (params.searchFilters) out.searchFilters = JSON.stringify(params.searchFilters)
  if (params.rangedFilters) out.rangedFilters = JSON.stringify(params.rangedFilters)
  if (params.page != null) out.page = String(params.page)
  if (params.rows != null) out.rows = String(params.rows)
  if (params.orderKey) out.orderKey = params.orderKey
  if (params.orderRule) out.orderRule = params.orderRule

  return out
}

