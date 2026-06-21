"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { type AxiosError } from "axios"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { queryKeys } from "@/lib/queryKeys"
import { type EzFilterParams, serialiseFilters } from "@/lib/serialiseFilters"
import type { ApiError, ApiResponse, PaginatedResponse } from "@/types/api"
import type { Task, TaskDependency, TaskStatus } from "@/types/task"

type TaskFieldsInput = {
  taskId: string
  version: number
  title?: string
  description?: string | null
  assigneeId?: string | null
  isClientVisible?: boolean
}

type CreateTaskInput = {
  title: string
  description?: string
  assigneeId?: string
  isClientVisible?: boolean
}

function isLockConflict(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error) && error.response?.data?.code === "OPTIMISTIC_LOCK_CONFLICT"
}

function handleTaskMutationError(
  error: unknown,
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
  taskId?: string
) {
  if (isLockConflict(error)) {
    toast.error("This task was updated by someone else. The page has been refreshed.")
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
    if (taskId) queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
    return
  }
  toast.error("The task could not be updated")
}

export function useTaskList(projectId: string, params: EzFilterParams) {
  return useQuery({
    queryKey: queryKeys.projects.tasks(projectId, params),
    queryFn: () =>
      api
        .get(`/projects/${projectId}/tasks`, { params: serialiseFilters(params) })
        .then((r) => r.data as PaginatedResponse<Task>),
    enabled: !!projectId,
  })
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => api.get(`/tasks/${taskId}`).then((r) => r.data as ApiResponse<Task>),
    enabled: !!taskId,
  })
}

export function useTaskDependencies(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.dependencies(taskId),
    queryFn: () =>
      api.get(`/tasks/${taskId}/dependencies`).then((r) => r.data as TaskDependency[]),
    enabled: !!taskId,
  })
}

export function useUpdateTaskStatus(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      status,
      version,
    }: {
      taskId: string
      status: TaskStatus
      version: number
    }) => api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status, version }),
    onSuccess: (_, { taskId }) => {
      toast.success("Task status updated")
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
    },
    onError: (error, { taskId }) => handleTaskMutationError(error, qc, projectId, taskId),
  })
}

export function useUpdateTaskFields(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, ...payload }: TaskFieldsInput) =>
      api.patch(`/projects/${projectId}/tasks/${taskId}`, payload),
    onSuccess: (_, { taskId }) => {
      toast.success("Task updated")
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
    },
    onError: (error, { taskId }) => handleTaskMutationError(error, qc, projectId, taskId),
  })
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskInput) => api.post(`/projects/${projectId}/tasks`, payload),
    onSuccess: () => {
      toast.success("Task created")
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
    },
    onError: () => toast.error("Could not create task"),
  })
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, version }: { taskId: string; version: number }) =>
      api.delete(`/projects/${projectId}/tasks/${taskId}`, { data: { version } }),
    onSuccess: () => {
      toast.success("Task deleted")
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
    },
    onError: (error, { taskId }) => handleTaskMutationError(error, qc, projectId, taskId),
  })
}

export function useAddDependency(taskId: string, projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dependsOnTaskId: string) => api.post(`/tasks/${taskId}/dependencies`, { dependsOnTaskId }),
    onSuccess: () => {
      toast.success("Dependency added")
      qc.invalidateQueries({ queryKey: queryKeys.tasks.dependencies(taskId) })
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
    },
    onError: () => toast.error("Could not add dependency"),
  })
}

export function useUploadAttachment(taskId: string, projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const body = new FormData()
      body.append("file", file)
      return api.post(`/tasks/${taskId}/attachments`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: () => {
      toast.success("Attachment uploaded")
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) })
      qc.invalidateQueries({ queryKey: queryKeys.tasks.attachments(taskId) })
      qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) })
    },
    onError: () => toast.error("Could not upload attachment"),
  })
}
