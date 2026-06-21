"use client"

import { Upload } from "lucide-react"
import { useRef } from "react"
import { useUploadAttachment } from "@/hooks/useTasks"

export function UploadAttachmentForm({ taskId, projectId }: { taskId: string; projectId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useUploadAttachment(taskId, projectId)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const file = inputRef.current?.files?.[0]
        if (file) mutate(file)
      }}
    >
      <div className="flex flex-wrap gap-2">
        <input className="text-sm" ref={inputRef} type="file" />
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[--nw-primary] px-3 text-sm font-medium text-white disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>
    </form>
  )
}

