"use client"

import { ArrowRight, Clock3, FolderKanban } from "lucide-react"
import Link from "next/link"
import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useClientProjects } from "@/hooks/useClientView"
import { useProjectList } from "@/hooks/useProjects"
import { useAuthStore } from "@/store/auth.store"
import type { Project, ProjectSummary } from "@/types/project"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  if (user?.role === "CLIENT_GUEST") return <ClientDashboard />
  return <InternalDashboard />
}

function InternalDashboard() {
  const projects = useProjectList({ page: 1, rows: 5, orderKey: "updatedAt", orderRule: "desc" })

  if (projects.isLoading) return <LoadingSpinner />
  if (projects.isError) return <ErrorState message="The dashboard could not load." onRetry={() => void projects.refetch()} />

  const projectCount = projects.data?.meta.total ?? 0
  const recentProjects = projects.data?.data ?? []

  return <DashboardView projectCount={projectCount} recentProjects={recentProjects} />
}

function ClientDashboard() {
  const projects = useClientProjects()

  if (projects.isLoading) return <LoadingSpinner />
  if (projects.isError) return <ErrorState message="The dashboard could not load." onRetry={() => void projects.refetch()} />

  const summaries = projects.data?.data ?? []
  const recentProjects: Project[] = summaries.slice(0, 5).map((summary, i) => {
    const fallback = summary as ProjectSummary & { id?: string; name?: string }
    return {
      id: fallback.projectId || fallback.id || `temp-${i}`,
      name: fallback.projectName || fallback.name || "Unknown Project",
      description: null,
      client: { id: "", name: "Client view", email: "" },
      createdAt: "",
      updatedAt: new Date().toISOString(),
    }
  })

  return <DashboardView isClient projectCount={summaries.length} recentProjects={recentProjects} />
}

function DashboardView({
  isClient = false,
  projectCount,
  recentProjects,
}: {
  isClient?: boolean
  projectCount: number
  recentProjects: Project[]
}) {
  const primaryHref = isClient ? "/client" : "/projects"

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border border-(--nw-border) bg-(--nw-surface) p-6 md:p-8">
          <div className="max-w-2xl border-l border-(--nw-primary) pl-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-(--nw-text-muted)] uppercase">
              Today
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-(--nw-text-primary)">
              {isClient ? "Review shared project progress." : "Start with the work that needs attention."}
            </h1>
            <p className="mt-3 text-step-2 leading-6 text-(--nw-text-secondary)">
              {isClient
                ? "Your view shows only client-visible tasks, milestones, and progress."
                : "Use this landing page to return to active boards and recent project movement."}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border-t border-(--nw-border) pt-4">
              <p className="text-[11px] tracking-[0.14em] text-(--nw-text-muted)] uppercase">Active workspaces</p>
              <p className="mt-2 font-mono text-4xl text-(--nw-text-primary)">{projectCount}</p>
            </div>
            <div className="border-t border-(--nw-border) pt-4">
              <p className="text-[11px] tracking-[0.14em] text-(--nw-text-muted)] uppercase">Next step</p>
              <Link className="mt-3 inline-flex items-center gap-2 text-step-1 font-medium text-(--nw-primary)" href={primaryHref}>
                {isClient ? "Open client projects" : "Open project directory"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <aside className="border border-(--nw-border) bg-(--nw-surface) p-5">
          <div className="flex items-center gap-2 border-b border-(--nw-border) pb-3">
            <Clock3 className="h-4 w-4 text-(--nw-text-muted)" />
            <h2 className="text-step-1 font-semibold text-(--nw-text-primary)">Recent movement</h2>
          </div>
          <div className="mt-4 space-y-3">
            {recentProjects.length ? (
              recentProjects.map((project) => (
                <Link
                  className="block border-l border-(--nw-border) pl-3 transition hover:border-(--nw-primary)"
                  href={isClient ? `/client/${project.id}` : `/projects/${project.id}`}
                  key={project.id}
                >
                  <p className="text-step-1 font-medium text-(--nw-text-primary)">{project.name}</p>
                  {project.updatedAt && (
                    <time className="mt-1 block font-mono text-[11px] text-(--nw-text-muted)" dateTime={project.updatedAt}>
                      {new Date(project.updatedAt).toLocaleString()}
                    </time>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-step-1 text-(--nw-text-muted)">No projects are waiting here.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-(--nw-border) bg-(--nw-surface)/75 p-5 md:col-span-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-(--nw-text-muted)" />
            <h2 className="text-step-1 font-semibold text-(--nw-text-primary)">Needs attention</h2>
          </div>
          <p className="mt-3 text-step-1 leading-6 text-(--nw-text-secondary)">
            {projectCount
              ? "Open a board to review blockers, stale tasks, and client-visible work before planning the day."
              : "Create or request access to a project to begin tracking delivery work."}
          </p>
        </div>
      </section>
    </div>
  )
}
