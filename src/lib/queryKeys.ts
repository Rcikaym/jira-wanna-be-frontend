export const queryKeys = {
	projects: {
		all: (params?: object) =>
			params ? (["projects", params] as const) : (["projects"] as const),
		detail: (id: string) => ["projects", id] as const,
		summary: (id: string) => ["projects", id, "summary"] as const,
		tasks: (id: string, params?: object) =>
			params
				? (["projects", id, "tasks", params] as const)
				: (["projects", id, "tasks"] as const),
		auditLog: (id: string, params?: object) =>
			params
				? (["projects", id, "audit-log", params] as const)
				: (["projects", id, "audit-log"] as const),
	},
	client: {
		projects: () => ["client", "projects"] as const,
		summary: (id: string) => ["client", "projects", id, "summary"] as const,
		tasks: (id: string, params?: object) =>
			params
				? (["client", "projects", id, "tasks", params] as const)
				: (["client", "projects", id, "tasks"] as const),
	},
	tasks: {
		detail: (projectId: string, id: string) =>
			["projects", projectId, "tasks", id] as const,
		dependencies: (projectId: string, id: string) =>
			["projects", projectId, "tasks", id, "dependencies"] as const,
		attachments: (id: string) => ["tasks", id, "attachments"] as const,
	},
	users: {
		all: (role?: string) =>
			role ? (["users", role] as const) : (["users"] as const),
	},
};
