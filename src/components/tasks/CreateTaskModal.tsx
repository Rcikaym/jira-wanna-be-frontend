"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";

export function CreateTaskModal({ projectId }: { projectId: string }) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [assigneeId, setAssigneeId] = useState("");
	const [isClientVisible, setIsClientVisible] = useState(false);
	const { mutate, isPending } = useCreateTask(projectId);
	const assignees = useUsers("INTERNAL");

	return (
		<>
			<button
				className="inline-flex h-10 items-center gap-2 rounded-md bg-(--nw-primary) px-3 text-step-1 font-medium text-(--nw-surface) transition hover:bg-(--nw-primary-hover)"
				onClick={() => setOpen(true)}
				type="button"
			>
				<Plus className="h-4 w-4" />
				New task
			</button>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-(--nw-text-primary)/35 p-4">
					<form
						className="w-full max-w-lg border border-(--nw-border) bg-(--nw-surface) p-5"
						onSubmit={(event) => {
							event.preventDefault();
							mutate(
								{
									title,
									description,
									assigneeId: assigneeId || undefined,
									isClientVisible,
								},
								{
									onSuccess: () => {
										setOpen(false);
										setTitle("");
										setDescription("");
										setAssigneeId("");
										setIsClientVisible(false);
									},
								},
							);
						}}
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-(--nw-text-primary)">
								Create task
							</h2>
							<button onClick={() => setOpen(false)} type="button">
								<X className="h-5 w-5 text-(--nw-text-muted)" />
							</button>
						</div>
						<div className="space-y-3">
							<input
								className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 outline-none transition focus:border-(--nw-primary)"
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Task title"
								required
								value={title}
							/>
							<textarea
								className="min-h-28 w-full rounded-md border border-(--nw-border) px-3 py-2 text-step-1 outline-none transition focus:border-(--nw-primary)"
								onChange={(event) => setDescription(event.target.value)}
								placeholder="Description"
								value={description}
							/>
							<select
								className="h-10 w-full rounded-md border border-(--nw-border) px-3 font-mono text-step-0 outline-none transition focus:border-(--nw-primary)"
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
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button
								className="h-9 rounded-md border border-(--nw-border) bg-(--nw-surface) px-3 text-step-1"
								onClick={() => setOpen(false)}
								type="button"
							>
								Cancel
							</button>
							<button
								className="h-9 rounded-md bg-(--nw-primary) px-3 text-step-1 font-medium text-(--nw-surface)"
								disabled={isPending || assignees.isLoading}
								type="submit"
							>
								Create
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}
