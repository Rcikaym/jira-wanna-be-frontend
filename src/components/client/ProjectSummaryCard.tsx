import Link from "next/link"
import type { ProjectSummary } from "@/types/project"

export function ProjectSummaryCard({ summary }: { summary: ProjectSummary }) {
  return (
    <div className="rounded-lg border border-[--nw-border] bg-[--nw-surface] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[--nw-text-primary]">{summary.projectName}</h3>
          <p className="mt-2 text-sm text-[--nw-text-secondary]">
            DONE {summary.byStatus.DONE} | IN_PROGRESS {summary.byStatus.IN_PROGRESS} | BLOCKED{" "}
            {summary.byStatus.BLOCKED} | BACKLOG {summary.byStatus.BACKLOG}
          </p>
          <Link className="mt-4 inline-block text-sm font-medium text-[--nw-primary]" href={`/client/${summary.projectId}`}>
            View Tasks
          </Link>
        </div>
        <ProgressRing percent={summary.percentComplete} />
      </div>
    </div>
  )
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 36
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg aria-label={`${percent}% complete`} height="88" viewBox="0 0 88 88" width="88">
      <circle cx="44" cy="44" fill="none" r={r} stroke="var(--nw-border)" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        fill="none"
        r={r}
        stroke="var(--nw-primary)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth="8"
        transform="rotate(-90 44 44)"
      />
      <text fill="var(--nw-text-primary)" fontSize="14" fontWeight="600" textAnchor="middle" x="44" y="48">
        {percent}%
      </text>
    </svg>
  )
}

