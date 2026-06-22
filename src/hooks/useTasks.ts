"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { serialiseFilters } from "@/lib/serialiseFilters";
import type { EzFilterParams } from "@/types/filters";
import type { ApiError, ApiResponse, PaginatedResponse } from "@/types/api";
import type { Task, TaskDependency, TaskStatus } from "@/types/task";

type TaskFieldsInput = {
	taskId: string;
	version: number;
	title?: string;
	description?: string | null;
	assigneeId?: string | null;
	isClientVisible?: boolean;
};

type CreateTaskInput = {
	title: string;
	description?: string;
	assigneeId?: string;
	isClientVisible?: boolean;
};

function isLockConflict(error: unknown): error is AxiosError<ApiError> {
	return (
		axios.isAxiosError(error) &&
		error.response?.data?.code === "OPTIMISTIC_LOCK_CONFLICT"
	);
}

function getApiErrorMessage(error: unknown, fallback: string) {
	if (!axios.isAxiosError<ApiError>(error)) return fallback;
	return (
		error.response?.data?.reason || error.response?.data?.error || fallback
	);
}

function handleTaskMutationError(
	error: unknown,
	queryClient: ReturnType<typeof useQueryClient>,
	projectId: string,
	taskId?: string,
) {
	if (isLockConflict(error)) {
		toast.error(
			"This task was updated by someone else. The page has been refreshed.",
		);
		queryClient.invalidateQueries({
			queryKey: queryKeys.projects.tasks(projectId),
		});
		if (taskId)
			queryClient.invalidateQueries({
				queryKey: queryKeys.tasks.detail(projectId, taskId),
			});
		return;
	}
	toast.error(getApiErrorMessage(error, "The task could not be updated"));
}

export function useTaskList(projectId: string, params: EzFilterParams) {
	return useQuery({
		queryKey: queryKeys.projects.tasks(projectId, params),
		queryFn: () =>
			api
				.get(`/projects/${projectId}/tasks`, {
					params: serialiseFilters(params),
				})
				.then((r) => r.data as PaginatedResponse<Task>),
		enabled: !!projectId,
		placeholderData: keepPreviousData,
	});
}

export function useTask(projectId: string, taskId: string) {
	return useQuery({
		queryKey: queryKeys.tasks.detail(projectId, taskId),
		queryFn: () =>
			api
				.get(`/projects/${projectId}/tasks/${taskId}`)
				.then((r) => r.data as ApiResponse<Task>),
		enabled: !!projectId && !!taskId,
	});
}

export function useTaskDependencies(projectId: string, taskId: string) {
	return useQuery({
		queryKey: queryKeys.tasks.dependencies(projectId, taskId),
		queryFn: () =>
			api
				.get(`/projects/${projectId}/tasks/${taskId}/dependencies`)
				.then((r) => (r.data as ApiResponse<TaskDependency[]>).data),
		enabled: !!projectId && !!taskId,
		retry: false,
	});
}

export function useUpdateTaskStatus(projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			taskId,
			status,
			version,
		}: {
			taskId: string;
			status: TaskStatus;
			version: number;
		}) =>
			api.patch(`/projects/${projectId}/tasks/${taskId}/status`, {
				status,
				version,
			}),
		onSuccess: (_, { taskId }) => {
			toast.success("Task status updated");
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
			qc.invalidateQueries({
				queryKey: queryKeys.tasks.detail(projectId, taskId),
			});
		},
		onError: (error, { taskId }) =>
			handleTaskMutationError(error, qc, projectId, taskId),
	});
}

export function useUpdateTaskFields(projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ taskId, ...payload }: TaskFieldsInput) =>
			api.patch(`/projects/${projectId}/tasks/${taskId}`, payload),
		onSuccess: (_, { taskId }) => {
			toast.success("Task updated");
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
			qc.invalidateQueries({
				queryKey: queryKeys.tasks.detail(projectId, taskId),
			});
		},
		onError: (error, { taskId }) =>
			handleTaskMutationError(error, qc, projectId, taskId),
	});
}

export function useCreateTask(projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateTaskInput) =>
			api.post(`/projects/${projectId}/tasks`, payload),
		onSuccess: () => {
			toast.success("Task created");
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
		},
		onError: () => toast.error("Could not create task"),
	});
}

export function useDeleteTask(projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ taskId, version }: { taskId: string; version: number }) =>
			api.delete(`/projects/${projectId}/tasks/${taskId}`, {
				data: { version },
			}),
		onSuccess: () => {
			toast.success("Task deleted");
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
		},
		onError: (error, { taskId }) =>
			handleTaskMutationError(error, qc, projectId, taskId),
	});
}

export function useAddDependency(taskId: string, projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dependsOnTaskId: string) =>
			api.post(`/projects/${projectId}/tasks/${taskId}/dependencies`, {
				dependsOnTaskId,
			}),
		onSuccess: () => {
			toast.success("Dependency added");
			qc.invalidateQueries({
				queryKey: queryKeys.tasks.dependencies(projectId, taskId),
			});
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
		},
		onError: (error) =>
			toast.error(getApiErrorMessage(error, "Could not add dependency")),
	});
}

export function useUploadAttachment(taskId: string, projectId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (file: File) => {
			return api.post(`/projects/${projectId}/tasks/${taskId}/attachments`, {
				fileName: file.name,
				// Fake URL since actual upload is stubbed on backend
				fileUrl: `https://fake-s3-bucket.com/${Date.now()}-${file.name}`,
			});
		},
		onSuccess: () => {
			toast.success("Attachment uploaded");
			qc.invalidateQueries({
				queryKey: queryKeys.tasks.detail(projectId, taskId),
			});
			qc.invalidateQueries({ queryKey: queryKeys.tasks.attachments(taskId) });
			qc.invalidateQueries({ queryKey: queryKeys.projects.tasks(projectId) });
		},
		onError: (error) =>
			toast.error(getApiErrorMessage(error, "Could not upload attachment")),
	});
}
