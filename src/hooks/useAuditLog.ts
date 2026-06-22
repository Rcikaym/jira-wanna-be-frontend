"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { queryKeys } from "@/lib/queryKeys"
import { serialiseFilters } from "@/lib/serialiseFilters"
import type { EzFilterParams } from "@/types/filters"
import type { PaginatedResponse } from "@/types/api"
import type { AuditLog } from "@/types/audit"

export function useAuditLog(projectId: string, params: EzFilterParams) {
  return useQuery({
    queryKey: queryKeys.projects.auditLog(projectId, params),
    queryFn: () =>
      api
        .get(`/projects/${projectId}/audit-log`, { params: serialiseFilters(params) })
        .then((r) => r.data as PaginatedResponse<AuditLog>),
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  })
}
