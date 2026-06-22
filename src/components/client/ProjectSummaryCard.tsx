import Link from "next/link";
import type { ProjectSummary } from "@/types/project";

export function ProjectSummaryCard({ summary }: { summary: ProjectSummary }) {
	const fallback = summary as ProjectSummary & { id?: string; name?: string };
	const projectId = fallback.projectId || fallback.id || "unknown";
	const projectName =
		fallback.projectName || fallback.name || "Unknown Project";
	const byStatus = summary.byStatus || {
		DONE: 0,
		IN_PROGRESS: 0,
		BLOCKED: 0,
		BACKLOG: 0,
	};
	const total =
		summary.total ||
		byStatus.DONE + byStatus.IN_PROGRESS + byStatus.BLOCKED + byStatus.BACKLOG;
	const percentComplete = total
		? Math.round((byStatus.DONE / total) * 100)
		: summary.percentComplete || 0;

	return (
		<div className="border border-(--nw-border) bg-(--nw-surface) p-5">
			<div className="flex items-center justify-between gap-6">
				<div className="border-l border-(--nw-border) pl-4">
					<h3 className="text-lg font-semibold tracking-normal text-(--nw-text-primary)">
						{projectName}
					</h3>
					<div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-step-1 text-(--nw-text-secondary)">
						<span>
							Done{" "}
							<span className="font-mono text-(--nw-text-primary)">
								{byStatus.DONE || 0}
							</span>
						</span>
						<span>
							In progress{" "}
							<span className="font-mono text-(--nw-text-primary)">
								{byStatus.IN_PROGRESS || 0}
							</span>
						</span>
						<span>
							Blocked{" "}
							<span className="font-mono text-(--nw-text-primary)">
								{byStatus.BLOCKED || 0}
							</span>
						</span>
						<span>
							Backlog{" "}
							<span className="font-mono text-(--nw-text-primary)">
								{byStatus.BACKLOG || 0}
							</span>
						</span>
					</div>
					<Link
						className="mt-5 inline-block text-step-1 font-medium text-(--nw-primary) underline-offset-4 hover:underline"
						href={`/client/${projectId}`}
					>
						View tasks
					</Link>
				</div>
				<ProgressRing percent={percentComplete} />
			</div>
		</div>
	);
}

function ProgressRing({ percent }: { percent: number }) {
	const r = 36;
	const circumference = 2 * Math.PI * r;
	const dash = (percent / 100) * circumference;
	const gap = circumference - dash;

	return (
		<svg
			aria-label={`${percent}% complete`}
			height="88"
			viewBox="0 0 88 88"
			width="88"
		>
			<circle
				cx="44"
				cy="44"
				fill="none"
				r={r}
				stroke="var(--nw-border)"
				strokeWidth="4"
			/>
			<circle
				cx="44"
				cy="44"
				fill="none"
				r={r}
				stroke="var(--sumi)"
				strokeDasharray={`${dash} ${gap}`}
				strokeDashoffset={0}
				strokeLinecap="round"
				strokeWidth="4"
				transform="rotate(-90 44 44)"
			/>
			<text
				fill="var(--nw-text-primary)"
				fontFamily="monospace"
				fontSize="14"
				fontWeight="500"
				textAnchor="middle"
				x="44"
				y="49"
			>
				{percent}%
			</text>
		</svg>
	);
}
