"use client"

import { useState } from "react"
import { useAddDependency, useTaskDependencies, useTaskList } from "@/hooks/useTasks"

export function AddDependencyModal({ taskId, projectId }: { taskId: string; projectId: string }) {
  const [dependsOnTaskId, setDependsOnTaskId] = useState("")
  const { mutate, isPending } = useAddDependency(taskId, projectId)

  // Fetch all tasks in the project (up to 100 for selection list)
  const { data: tasksData, isLoading: isLoadingTasks, isError: isTasksError } = useTaskList(projectId, { page: 1, rows: 100 })
  // Fetch existing dependencies for the task
  const { data: dependencies, isLoading: isLoadingDeps, isError: isDepsError } = useTaskDependencies(projectId, taskId)

  const tasks = tasksData?.data ?? []
  const existingDepIds = new Set(dependencies?.map((dep) => dep.dependsOnTask.id) ?? [])
  
  // Filter out current task and tasks that are already dependencies
  const availableTasks = tasks.filter((t) => t.id !== taskId && !existingDepIds.has(t.id))

  const isLoading = isLoadingTasks || isLoadingDeps
  const isError = isTasksError || isDepsError

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (dependsOnTaskId) {
      mutate(dependsOnTaskId, {
        onSuccess: () => {
          setDependsOnTaskId("")
        }
      })
    }
  }

  return (
    <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
      <select
        className="h-9 min-w-56 rounded-md border border-(--nw-border) px-3 text-step-1 outline-none transition focus:border-(--nw-primary) disabled:opacity-60 bg-(--nw-surface) text-(--nw-text-primary)"
        disabled={isLoading || isPending || availableTasks.length === 0}
        onChange={(event) => setDependsOnTaskId(event.target.value)}
        value={dependsOnTaskId}
      >
        {isLoading ? (
          <option value="">Loading tasks...</option>
        ) : isError ? (
          <option value="">Error loading tasks</option>
        ) : availableTasks.length === 0 ? (
          <option value="">No available tasks for dependency</option>
        ) : (
          <>
            <option value="">Select a dependency task...</option>
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.status.replace("_", " ")})
              </option>
            ))}
          </>
        )}
      </select>
      <button
        className="h-9 rounded-md border border-(--nw-border) bg-(--nw-surface) px-3 text-step-1 transition hover:border-(--nw-primary) disabled:opacity-60"
        disabled={isPending || isLoading || !dependsOnTaskId}
        type="submit"
      >
        Add dependency
      </button>
    </form>
  )
}

