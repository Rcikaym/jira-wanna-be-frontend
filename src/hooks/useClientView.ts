"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { queryKeys } from "@/lib/queryKeys"
import { serialiseFilters } from "@/lib/serialiseFilters"
import type { EzFilterParams } from "@/types/filters"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import type { ProjectSummary } from "@/types/project"
import type { ClientTask } from "@/types/task"

export function useClientProjects() {
  return useQuery({
    queryKey: queryKeys.client.projects(),
    queryFn: () => api.get("/client/projects").then((r) => r.data as ApiResponse<ProjectSummary[]>),
  })
}

export function useClientProjectSummary(projectId: string) {
  return useQuery({
    queryKey: queryKeys.client.summary(projectId),
    queryFn: () =>
      api.get(`/client/projects/${projectId}/summary`).then((r) => r.data as ApiResponse<ProjectSummary>),
    enabled: !!projectId,
  })
}

export function useClientTasks(projectId: string, params: EzFilterParams) {
  return useQuery({
    queryKey: queryKeys.client.tasks(projectId, params),
    queryFn: () =>
      api
        .get(`/client/projects/${projectId}/tasks`, { params: serialiseFilters(params) })
        .then((r) => r.data as PaginatedResponse<ClientTask>),
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  })
}

