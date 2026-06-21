export type ApiResponse<T> = {
  message: string
  data: T
}

export type PaginatedResponse<T> = {
  message: string
  data: T[]
  meta: { total: number; page: number; rows: number }
}

export type ApiError = {
  error: string
  code?: string
  details?: unknown
}

