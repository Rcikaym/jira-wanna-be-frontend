"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { serialiseFilters } from "@/lib/serialiseFilters";
import type { EzFilterParams } from "@/types/filters";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Project } from "@/types/project";

type CreateProjectInput = {
	name: string;
	description?: string;
	clientId: string;
};

export function useProjectList(params: EzFilterParams) {
	return useQuery({
		queryKey: queryKeys.projects.all(params),
		queryFn: () =>
			api
				.get("/projects", { params: serialiseFilters(params) })
				.then((r) => r.data as PaginatedResponse<Project>),
		placeholderData: keepPreviousData,
	});
}

export function useProject(projectId: string) {
	return useQuery({
		queryKey: queryKeys.projects.detail(projectId),
		queryFn: () =>
			api
				.get(`/projects/${projectId}`)
				.then((r) => r.data as ApiResponse<Project>),
		enabled: !!projectId,
	});
}

export function useCreateProject() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateProjectInput) => api.post("/projects", payload),
		onSuccess: () => {
			toast.success("Project created");
			qc.invalidateQueries({ queryKey: queryKeys.projects.all() });
		},
		onError: () => toast.error("Could not create project"),
	});
}
