"use client"

import { ProjectSummaryCard } from "@/components/client/ProjectSummaryCard"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useClientProjects } from "@/hooks/useClientView"

export default function ClientProjectsPage() {
  const { data, isError, isLoading, refetch } = useClientProjects()

  return (
    <RoleGuard allow={["CLIENT_GUEST"]}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-[--nw-text-primary]">My Project</h1>
          <p className="mt-1 text-sm text-[--nw-text-secondary]">Client-visible progress and task status.</p>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorState message="Failed to load client projects" onRetry={() => void refetch()} />
        ) : !data?.data.length ? (
          <EmptyState message="No client projects found" />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {data.data.map((summary) => (
              <ProjectSummaryCard key={summary.projectId} summary={summary} />
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}

