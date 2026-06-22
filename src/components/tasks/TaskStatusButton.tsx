"use client";

import { Info } from "lucide-react";
import { useUpdateTaskStatus } from "@/hooks/useTasks";
import { computeAvailableActions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import type { Task, TaskDependency } from "@/types/task";

type Props = {
	task: Task;
	projectId: string;
	dependencies: TaskDependency[];
	dependenciesKnown?: boolean;
};

export function TaskStatusButton({
	task,
	projectId,
	dependencies,
	dependenciesKnown = true,
}: Props) {
	const user = useAuthStore((state) => state.user);
	const { mutate: updateStatus, isPending } = useUpdateTaskStatus(projectId);
	const allDepsDone = dependencies.every(
		(d) => d.dependsOnTask.status === "DONE",
	);
	const actions = computeAvailableActions(
		user,
		task,
		allDepsDone,
		dependenciesKnown,
	);

	if (actions.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{actions.map((action) => (
				<button
					className={cn(
						"inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-step-1 font-medium transition-colors",
						action.disabled
							? "cursor-not-allowed bg-(--nw-border) text-(--nw-text-muted) opacity-60"
							: "bg-(--nw-primary) text-(--nw-surface) hover:bg-(--nw-primary-hover)",
					)}
					disabled={action.disabled || isPending}
					key={action.nextStatus}
					onClick={() =>
						updateStatus({
							taskId: task.id,
							status: action.nextStatus,
							version: task.version,
						})
					}
					title={action.disabled ? action.reason : undefined}
					type="button"
				>
					{action.disabled && <Info className="h-3.5 w-3.5" />}
					{action.label}
				</button>
			))}
		</div>
	);
}
