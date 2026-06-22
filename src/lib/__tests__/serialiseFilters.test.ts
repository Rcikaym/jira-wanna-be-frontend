import { describe, it, expect } from "bun:test"
import { serialiseFilters } from "../serialiseFilters"

describe("serialiseFilters", () => {
  it("JSON.stringifies filters", () => {
    const result = serialiseFilters({ filters: { status: "DONE" } })
    expect(result.filters).toBe('{"status":"DONE"}')
  })

  it("JSON.stringifies searchFilters", () => {
    const result = serialiseFilters({ searchFilters: { title: "frontend" } })
    expect(result.searchFilters).toBe('{"title":"frontend"}')
  })

  it("JSON.stringifies rangedFilters array", () => {
    const result = serialiseFilters({
      rangedFilters: [{ key: "createdAt", start: "2024-01-01", end: "2024-12-31" }],
    })
    expect(result.rangedFilters).toBe(
      '[{"key":"createdAt","start":"2024-01-01","end":"2024-12-31"}]'
    )
  })

  it("converts page and rows to strings", () => {
    const result = serialiseFilters({ page: 2, rows: 25 })
    expect(result.page).toBe("2")
    expect(result.rows).toBe("25")
  })

  it("omits keys with empty objects", () => {
    const result = serialiseFilters({ filters: {} })
    expect(result.filters).toBeUndefined()
  })

  it("omits keys with empty arrays", () => {
    const result = serialiseFilters({ rangedFilters: [] })
    expect(result.rangedFilters).toBeUndefined()
  })

  it("handles multi-value OR filter (array value)", () => {
    const result = serialiseFilters({ filters: { status: ["DONE", "IN_PROGRESS"] } })
    expect(result.filters).toBe('{"status":["DONE","IN_PROGRESS"]}')
  })

  it("combines all 7 params correctly", () => {
    const result = serialiseFilters({
      filters: { status: "DONE" },
      searchFilters: { title: "api" },
      rangedFilters: [{ key: "createdAt", start: "2024-01-01", end: "2024-12-31" }],
      page: 1,
      rows: 10,
      orderKey: "createdAt",
      orderRule: "asc",
    })
    expect(Object.keys(result)).toHaveLength(7)
  })
})
