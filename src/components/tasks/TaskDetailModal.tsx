"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
	useTask,
	useTaskDependencies,
	useUpdateTaskFields,
} from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import type { Task } from "@/types/task";
import { AddDependencyModal } from "./AddDependencyModal";
import { AttachmentList } from "./AttachmentList";
import { DependencyList } from "./DependencyList";
import { TaskStatusButton } from "./TaskStatusButton";
import { UploadAttachmentForm } from "./UploadAttachmentForm";

export function TaskDetailModal({
	open,
	onClose,
	task,
	projectId,
}: {
	open: boolean;
	onClose: () => void;
	task: Task;
	projectId: string;
}) {
	const taskQuery = useTask(projectId, open ? task.id : "");
	const dependencyQuery = useTaskDependencies(projectId, open ? task.id : "");
	const liveTask = taskQuery.data?.data ?? task;

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-(--nw-text-primary)/35 p-4">
			<section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-(--nw-border) bg-(--nw-surface)">
				<div className="flex items-start justify-between border-b border-(--nw-border) p-5">
					<div>
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<StatusBadge status={liveTask.status} />
							{liveTask.isClientVisible && (
								<span className="border-l border-(--nw-border) pl-2 text-xs text-(--nw-text-muted)">
									Client visible
								</span>
							)}
						</div>
						<h2 className="text-xl font-semibold text-(--nw-text-primary)">
							{liveTask.title}
						</h2>
						<p className="mt-1 text-step-1 text-(--nw-text-secondary)">
							{liveTask.project.name}
						</p>
					</div>
					<button
						className="rounded-md p-1 text-(--nw-text-muted) hover:bg-(--nw-background)"
						onClick={onClose}
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<div className="grid gap-6 p-5 md:grid-cols-[1fr_260px]">
					<div className="space-y-6">
						{taskQuery.isLoading ? (
							<LoadingSpinner />
						) : taskQuery.isError ? (
							<ErrorState
								message="Failed to load task detail"
								onRetry={() => void taskQuery.refetch()}
							/>
						) : (
							<>
								<section>
									<h3 className="text-step-1 font-semibold text-(--nw-text-primary)">
										Description
									</h3>
									<p className="mt-2 whitespace-pre-wrap text-step-1 leading-6 text-(--nw-text-secondary)">
										{liveTask.description || "No description"}
									</p>
								</section>
								<RoleGuard allow={["PM"]} fallback={null}>
									<section className="rounded-md border border-(--nw-border) p-3">
										<h3 className="text-step-1 font-semibold text-(--nw-text-primary)">
											PM controls
										</h3>
										<PmTaskFieldsForm projectId={projectId} task={liveTask} />
										<div className="mt-3">
											<AddDependencyModal
												projectId={projectId}
												taskId={liveTask.id}
											/>
										</div>
									</section>
								</RoleGuard>
								<section>
									<h3 className="text-step-1 font-semibold text-(--nw-text-primary)">
										Dependencies
									</h3>
									<div className="mt-2">
										<DependencyList
											projectId={projectId}
											taskId={liveTask.id}
										/>
									</div>
								</section>
								<section>
									<h3 className="text-step-1 font-semibold text-(--nw-text-primary)">
										Attachments
									</h3>
									<div className="mt-2">
										<AttachmentList attachments={liveTask.attachments} />
									</div>
									<RoleGuard allow={["INTERNAL"]} fallback={null}>
										<div className="mt-3">
											<UploadAttachmentForm
												projectId={projectId}
												taskId={liveTask.id}
											/>
										</div>
									</RoleGuard>
								</section>
							</>
						)}
					</div>
					<aside className="space-y-4">
						<div className="rounded-md border border-(--nw-border) p-3">
							<h3 className="text-step-1 font-semibold text-(--nw-text-primary)">
								Assignee
							</h3>
							<p className="mt-1 text-step-1 text-(--nw-text-secondary)">
								{liveTask.assignee?.name ?? "Unassigned"}
							</p>
						</div>
						<div className="rounded-md border border-(--nw-border) p-3">
							<h3 className="mb-3 text-step-1 font-semibold text-(--nw-text-primary)">
								Status actions
							</h3>
							<TaskStatusButton
								dependencies={dependencyQuery.data ?? []}
								dependenciesKnown={!dependencyQuery.isError}
								projectId={projectId}
								task={liveTask}
							/>
						</div>
					</aside>
				</div>
			</section>
		</div>
	);
}

function PmTaskFieldsForm({
	projectId,
	task,
}: {
	projectId: string;
	task: Task;
}) {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description ?? "");
	const [assigneeId, setAssigneeId] = useState(task.assignee?.id ?? "");
	const [isClientVisible, setIsClientVisible] = useState(task.isClientVisible);
	const { mutate, isPending } = useUpdateTaskFields(projectId);
	const assignees = useUsers("INTERNAL");

	useEffect(() => {
		setTitle(task.title);
		setDescription(task.description ?? "");
		setAssigneeId(task.assignee?.id ?? "");
		setIsClientVisible(task.isClientVisible);
	}, [task]);

	return (
		<form
			className="mt-3 space-y-3"
			onSubmit={(event) => {
				event.preventDefault();
				mutate({
					taskId: task.id,
					version: task.version,
					title,
					description,
					assigneeId: assigneeId || null,
					isClientVisible,
				});
			}}
		>
			<input
				className="h-9 w-full rounded-md border border-(--nw-border) px-3 text-step-1 outline-none transition focus:border-(--nw-primary)"
				onChange={(event) => setTitle(event.target.value)}
				placeholder="Task title"
				required
				value={title}
			/>
			<textarea
				className="min-h-20 w-full rounded-md border border-(--nw-border) px-3 py-2 text-step-1 outline-none transition focus:border-(--nw-primary)"
				onChange={(event) => setDescription(event.target.value)}
				placeholder="Description"
				value={description}
			/>
			<select
				className="h-9 w-full rounded-md border border-(--nw-border) px-3 font-mono text-step-0 outline-none transition focus:border-(--nw-primary)"
				onChange={(event) => setAssigneeId(event.target.value)}
				value={assigneeId}
			>
				<option value="">
					{assignees.isLoading ? "Loading assignees..." : "Unassigned"}
				</option>
				{assignees.data?.map((assignee) => (
					<option key={assignee.id} value={assignee.id}>
						{assignee.name} ({assignee.department ?? "Internal"})
					</option>
				))}
			</select>
			{assignees.isError && (
				<p className="text-xs text-(--nw-danger)">
					Could not load internal assignees.
				</p>
			)}
			<label className="flex items-center gap-2 text-step-1 text-(--nw-text-secondary)">
				<input
					checked={isClientVisible}
					onChange={(event) => setIsClientVisible(event.target.checked)}
					type="checkbox"
				/>
				Client visible
			</label>
			<button
				className="h-9 rounded-md bg-(--nw-primary) px-3 text-step-1 font-medium text-(--nw-surface) disabled:opacity-60"
				disabled={isPending || assignees.isLoading}
				type="submit"
			>
				Save task
			</button>
		</form>
	);
}
