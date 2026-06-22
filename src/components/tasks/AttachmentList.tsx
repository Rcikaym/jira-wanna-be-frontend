import type { Task } from "@/types/task"

export function AttachmentList({ attachments }: { attachments: Task["attachments"] }) {
  if (!attachments.length) return <p className="text-step-1 text-(--nw-text-muted)">No attachments</p>
  return (
    <ul className="space-y-2">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a className="text-step-1 font-medium text-(--nw-primary)] underline-offset-4 hover:underline" href={attachment.fileUrl} rel="noreferrer" target="_blank">
            {attachment.fileName}
          </a>
        </li>
      ))}
    </ul>
  )
}
