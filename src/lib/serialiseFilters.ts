/**
 * QUERY STANDARD - MANUAL VERIFICATION
 *
 * Open the browser network tab and confirm the following:
 *
 * 1. EXACT FILTER
 *    Set status filter to "BLOCKED"
 *    Request should include: filters=%7B%22status%22%3A%22BLOCKED%22%7D
 *    (URL-encoded form of filters={"status":"BLOCKED"})
 *    Response should contain only BLOCKED tasks
 *
 * 2. SEARCH FILTER
 *    Type "frontend" in the search box
 *    Request should include: searchFilters=%7B%22title%22%3A%22frontend%22%7D
 *    Response should contain tasks whose title contains "frontend" (case-insensitive)
 *
 * 3. COMBINED FILTER + SEARCH
 *    Set status = "BLOCKED" and search = "design"
 *    Both filters and searchFilters should appear in the request
 *    Response should contain only BLOCKED tasks whose title contains "design"
 *
 * 4. RANGED FILTER (audit log)
 *    Set date range from 2024-01-01 to 2024-12-31
 *    rangedFilters should be URL-encoded JSON array
 *    Response should contain only entries within that date range
 *
 * 5. PAGINATION
 *    Set rows = 10, navigate to page 2
 *    Request should include page=2&rows=10
 *    "Showing 11–20 of N" should appear in the pagination component
 *    Total page count should be Math.ceil(N / 10)
 *
 * 6. SORT
 *    Click "Created" sort button once → orderKey=createdAt&orderRule=desc
 *    Click again → orderKey=createdAt&orderRule=asc
 *    List order should visibly change
 *
 * 7. RESET
 *    Apply several filters, then click "Clear all filters"
 *    All filter state should reset, page returns to 1
 *    Request should have no filters, searchFilters, or rangedFilters params
 */

import type { EzFilterParams, SerialisedParams } from "@/types/filters"

export function serialiseFilters(params: EzFilterParams): SerialisedParams {
  const out: SerialisedParams = {}

  if (params.filters && Object.keys(params.filters).length > 0) {
    out.filters = JSON.stringify(params.filters)
  }

  if (params.searchFilters && Object.keys(params.searchFilters).length > 0) {
    out.searchFilters = JSON.stringify(params.searchFilters)
  }

  if (params.rangedFilters && params.rangedFilters.length > 0) {
    out.rangedFilters = JSON.stringify(params.rangedFilters)
  }

  if (params.page != null) {
    out.page = String(params.page)
  }

  if (params.rows != null) {
    out.rows = String(params.rows)
  }

  if (params.orderKey) {
    out.orderKey = params.orderKey
  }

  if (params.orderRule) {
    out.orderRule = params.orderRule
  }

  return out
}
