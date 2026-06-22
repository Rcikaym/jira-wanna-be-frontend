"use client";

import { ProjectSummaryCard } from "@/components/client/ProjectSummaryCard";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useClientProjects } from "@/hooks/useClientView";

export default function ClientProjectsPage() {
	const { data, isError, isLoading, refetch } = useClientProjects();

	return (
		<RoleGuard allow={["CLIENT_GUEST"]}>
			<div className="space-y-7">
				<div className="border-l border-(--nw-primary) pl-4">
					<h1 className="text-2xl font-semibold text-(--nw-text-primary)">
						My Project
					</h1>
					<p className="mt-2 max-w-xl text-step-1 leading-6 text-(--nw-text-secondary)">
						Shared progress, visible tasks, and delivery status. Internal notes
						and audit history stay private.
					</p>
				</div>
				{isLoading ? (
					<LoadingSpinner />
				) : isError ? (
					<ErrorState
						message="Failed to load client projects"
						onRetry={() => void refetch()}
					/>
				) : !data?.data.length ? (
					<EmptyState message="No shared projects are available." />
				) : (
					<div className="grid gap-4 lg:grid-cols-2">
						{data.data.map((summary, index) => (
							<ProjectSummaryCard
								key={
									summary.projectId ||
									(summary as unknown as { id?: string }).id ||
									index
								}
								summary={summary}
							/>
						))}
					</div>
				)}
			</div>
		</RoleGuard>
	);
}
