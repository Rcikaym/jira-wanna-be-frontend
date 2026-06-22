"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useCreateProject } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";

export function CreateProjectModal() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clientId, setClientId] = useState("");
	const { mutate, isPending } = useCreateProject();
	const clients = useUsers("CLIENT_GUEST");

	return (
		<>
			<button
				className="inline-flex h-10 items-center gap-2 rounded-md bg-(--nw-primary) px-3 text-step-1 font-medium text-(--nw-surface) transition hover:bg-(--nw-primary-hover)"
				onClick={() => setOpen(true)}
				type="button"
			>
				<Plus className="h-4 w-4" />
				New project
			</button>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-(--nw-text-primary)/35 p-4">
					<form
						className="w-full max-w-lg border border-(--nw-border) bg-(--nw-surface) p-5"
						onSubmit={(event) => {
							event.preventDefault();
							mutate(
								{ name, description, clientId },
								{
									onSuccess: () => {
										setOpen(false);
										setName("");
										setDescription("");
										setClientId("");
									},
								},
							);
						}}
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-(--nw-text-primary)">
								Create project
							</h2>
							<button onClick={() => setOpen(false)} type="button">
								<X className="h-5 w-5 text-(--nw-text-muted)" />
							</button>
						</div>
						<div className="space-y-3">
							<input
								className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 outline-none transition focus:border-(--nw-primary)"
								onChange={(event) => setName(event.target.value)}
								placeholder="Project name"
								required
								value={name}
							/>
							<textarea
								className="min-h-24 w-full rounded-md border border-(--nw-border) px-3 py-2 text-step-1 outline-none transition focus:border-(--nw-primary)"
								onChange={(event) => setDescription(event.target.value)}
								placeholder="Description"
								value={description}
							/>
							<select
								className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 outline-none transition focus:border-(--nw-primary)"
								onChange={(event) => setClientId(event.target.value)}
								required
								value={clientId}
							>
								<option value="">
									{clients.isLoading ? "Loading clients..." : "Select client"}
								</option>
								{clients.data?.map((client) => (
									<option key={client.id} value={client.id}>
										{client.name} ({client.email})
									</option>
								))}
							</select>
							{clients.isError && (
								<p className="text-xs text-(--nw-danger)">
									Could not load client users.
								</p>
							)}
							{!clients.isLoading && !clients.data?.length && (
								<p className="text-xs text-(--nw-text-muted)">
									No client guest users are available.
								</p>
							)}
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
								disabled={isPending || clients.isLoading || !clientId}
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
