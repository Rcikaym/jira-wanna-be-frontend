import Link from "next/link"
import type { Project } from "@/types/project"

export function ProjectCard({ project, href }: { project: Project; href?: string }) {
  return (
    <Link
      className="grid gap-3 border border-(--nw-border) bg-(--nw-surface) p-4 transition hover:border-(--nw-primary) sm:grid-cols-[1fr_180px_120px] sm:items-center"
      href={href ?? `/projects/${project.id}`}
    >
      <div className="border-l border-(--nw-primary) pl-3">
        <h3 className="font-semibold text-(--nw-text-primary)">{project.name}</h3>
        <p className="mt-1 line-clamp-1 text-step-1 text-(--nw-text-secondary)">
          {project.description || "No project description"}
        </p>
      </div>
      <p className="text-step-1 text-(--nw-text-secondary)">{project.client?.name || "No client"}</p>
      <time className="font-mono text-step-1 text-(--nw-text-muted)" dateTime={project.updatedAt}>
        {new Date(project.updatedAt).toLocaleDateString()}
      </time>
    </Link>
  )
}
