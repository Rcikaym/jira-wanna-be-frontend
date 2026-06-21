"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Pagination } from "@/components/shared/Pagination"
import { useProjectList } from "@/hooks/useProjects"
import type { EzFilterParams } from "@/lib/serialiseFilters"
import { ProjectCard } from "./ProjectCard"

export function ProjectList({
  params,
  onPageChange,
  onRowsChange,
}: {
  params: EzFilterParams
  onPageChange: (page: number) => void
  onRowsChange: (rows: number) => void
}) {
  const { data, isError, isLoading, refetch } = useProjectList(params)

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="Failed to load projects" onRetry={() => void refetch()} />
  if (!data?.data.length) return <EmptyState message="No projects found" />

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Pagination
        onPageChange={onPageChange}
        onRowsChange={onRowsChange}
        page={params.page ?? 1}
        rows={params.rows ?? 10}
        total={data.meta.total}
      />
    </div>
  )
}

