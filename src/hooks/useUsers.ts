"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import type { ApiResponse } from "@/types/api";
import type { Role } from "@/types/auth";
import type { UserOption } from "@/types/user";

export function useUsers(role?: Role) {
	return useQuery({
		queryKey: queryKeys.users.all(role),
		queryFn: () =>
			api
				.get("/users", { params: role ? { role } : undefined })
				.then((r) => (r.data as ApiResponse<UserOption[]>).data),
	});
}
