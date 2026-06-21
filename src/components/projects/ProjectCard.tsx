import Link from "next/link"
import type { Project } from "@/types/project"

export function ProjectCard({ project, href }: { project: Project; href?: string }) {
  return (
    <Link
      className="block rounded-lg border border-[--nw-border] bg-[--nw-surface] p-4 transition hover:border-[--nw-primary] hover:shadow-sm"
      href={href ?? `/projects/${project.id}`}
    >
      <h3 className="font-semibold text-[--nw-text-primary]">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-[--nw-text-secondary]">
        {project.description || "No description"}
      </p>
      <p className="mt-3 text-xs text-[--nw-text-muted]">{project.client.name}</p>
    </Link>
  )
}

