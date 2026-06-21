"use client"

import { useState } from "react"
import { useAddDependency } from "@/hooks/useTasks"

export function AddDependencyModal({ taskId, projectId }: { taskId: string; projectId: string }) {
  const [dependsOnTaskId, setDependsOnTaskId] = useState("")
  const { mutate, isPending } = useAddDependency(taskId, projectId)

  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (dependsOnTaskId) mutate(dependsOnTaskId)
      }}
    >
      <input
        className="h-9 min-w-56 rounded-md border border-[--nw-border] px-3 text-sm"
        onChange={(event) => setDependsOnTaskId(event.target.value)}
        placeholder="Dependency task ID"
        value={dependsOnTaskId}
      />
      <button className="h-9 rounded-md border border-[--nw-border] px-3 text-sm" disabled={isPending} type="submit">
        Add dependency
      </button>
    </form>
  )
}

