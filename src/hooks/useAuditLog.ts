"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { queryKeys } from "@/lib/queryKeys"
import { type EzFilterParams, serialiseFilters } from "@/lib/serialiseFilters"
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
  })
}

