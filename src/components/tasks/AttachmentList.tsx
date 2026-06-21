import type { Task } from "@/types/task"

export function AttachmentList({ attachments }: { attachments: Task["attachments"] }) {
  if (!attachments.length) return <p className="text-sm text-[--nw-text-muted]">No attachments</p>
  return (
    <ul className="space-y-2">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a className="text-sm font-medium text-[--nw-primary] underline" href={attachment.fileUrl} rel="noreferrer" target="_blank">
            {attachment.fileName}
          </a>
        </li>
      ))}
    </ul>
  )
}

