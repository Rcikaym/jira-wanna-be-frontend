import { useState, useCallback } from "react"
import type { EzFilterParams, OrderRule, RangedFilter } from "@/types/filters"

type UseQueryParamsOptions = {
  defaultRows?: number
  defaultOrderKey?: string
  defaultOrderRule?: OrderRule
}

export function useQueryParams(options: UseQueryParamsOptions = {}) {
  const [params, setParams] = useState<EzFilterParams>({
    page: 1,
    rows: options.defaultRows ?? 10,
    orderKey: options.defaultOrderKey,
    orderRule: options.defaultOrderRule ?? "desc",
  })

  // Replace a single filter key — resets page to 1
  const setFilter = useCallback((key: string, value: unknown) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }))
  }, [])

  // Remove a single filter key
  const clearFilter = useCallback((key: string) => {
    setParams((prev) => {
      const next = { ...prev.filters }
      delete next[key]
      return { ...prev, page: 1, filters: next }
    })
  }, [])

  // Set a partial-match search across one or more columns — resets page to 1
  // All targeted columns must share the same data type (backend constraint)
  const setSearch = useCallback((columns: Record<string, string>) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchFilters: columns,
    }))
  }, [])

  // Clear all search
  const clearSearch = useCallback(() => {
    setParams((prev) => ({ ...prev, page: 1, searchFilters: undefined }))
  }, [])

  // Set a ranged filter for a single key — merges with existing rangedFilters
  const setRangedFilter = useCallback((filter: RangedFilter) => {
    setParams((prev) => {
      const existing = (prev.rangedFilters ?? []).filter((f) => f.key !== filter.key)
      return { ...prev, page: 1, rangedFilters: [...existing, filter] }
    })
  }, [])

  // Remove a ranged filter by key
  const clearRangedFilter = useCallback((key: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      rangedFilters: (prev.rangedFilters ?? []).filter((f) => f.key !== key),
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  const setRows = useCallback((rows: number) => {
    setParams((prev) => ({ ...prev, page: 1, rows }))
  }, [])

  const setSort = useCallback((orderKey: string, orderRule: OrderRule) => {
    setParams((prev) => ({ ...prev, orderKey, orderRule }))
  }, [])

  const resetAll = useCallback(() => {
    setParams({
      page: 1,
      rows: options.defaultRows ?? 10,
      orderKey: options.defaultOrderKey,
      orderRule: options.defaultOrderRule ?? "desc",
    })
  }, [options.defaultRows, options.defaultOrderKey, options.defaultOrderRule])

  return {
    params,
    setFilter,
    clearFilter,
    setSearch,
    clearSearch,
    setRangedFilter,
    clearRangedFilter,
    setPage,
    setRows,
    setSort,
    resetAll,
  }
}
