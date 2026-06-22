"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusDot } from "@/components/shared/StatusDot";
import { useTaskDependencies } from "@/hooks/useTasks";

export function DependencyList({
	projectId,
	taskId,
}: {
	projectId: string;
	taskId: string;
}) {
	const { data, isError, isLoading } = useTaskDependencies(projectId, taskId);

	if (isLoading) return <LoadingSpinner size="sm" />;
	if (isError) {
		return (
			<p className="text-step-1 text-(--nw-blocked)">
				Dependency details are unavailable from the API.
			</p>
		);
	}
	if (!data?.length)
		return (
			<p className="text-step-1 text-(--nw-text-muted)">No dependencies</p>
		);

	return (
		<ul className="space-y-1">
			{data.map((dep) => (
				<li
					className="flex flex-wrap items-center gap-2 text-step-1"
					key={dep.id ?? dep.dependsOnTask.id}
				>
					<StatusDot status={dep.dependsOnTask.status} />
					<span className="text-(--nw-text-primary)">
						{dep.dependsOnTask.title}
					</span>
					<StatusBadge size="xs" status={dep.dependsOnTask.status} />
					{dep.dependsOnTask.status !== "DONE" && (
						<span className="text-xs text-(--nw-blocked)">Blocking</span>
					)}
				</li>
			))}
		</ul>
	);
}
