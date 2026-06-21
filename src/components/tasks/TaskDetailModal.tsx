"use client"

import { X } from "lucide-react"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { useTask, useTaskDependencies } from "@/hooks/useTasks"
import type { Task } from "@/types/task"
import { AddDependencyModal } from "./AddDependencyModal"
import { AttachmentList } from "./AttachmentList"
import { DependencyList } from "./DependencyList"
import { TaskStatusButton } from "./TaskStatusButton"
import { UploadAttachmentForm } from "./UploadAttachmentForm"

export function TaskDetailModal({
  open,
  onClose,
  task,
  projectId,
}: {
  open: boolean
  onClose: () => void
  task: Task
  projectId: string
}) {
  const taskQuery = useTask(open ? task.id : "")
  const dependencyQuery = useTaskDependencies(open ? task.id : "")
  const liveTask = taskQuery.data?.data ?? task

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-[--nw-surface] shadow-xl">
        <div className="flex items-start justify-between border-b border-[--nw-border] p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={liveTask.status} />
              {liveTask.isClientVisible && (
                <span className="rounded-full bg-[--nw-primary-light] px-2 py-1 text-xs text-[--nw-primary]">
                  Client visible
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-[--nw-text-primary]">{liveTask.title}</h2>
            <p className="mt-1 text-sm text-[--nw-text-secondary]">{liveTask.project.name}</p>
          </div>
          <button className="rounded-md p-1 text-[--nw-text-muted] hover:bg-[--nw-background]" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_260px]">
          <div className="space-y-6">
            {taskQuery.isLoading ? (
              <LoadingSpinner />
            ) : taskQuery.isError ? (
              <ErrorState message="Failed to load task detail" onRetry={() => void taskQuery.refetch()} />
            ) : (
              <>
                <section>
                  <h3 className="text-sm font-semibold text-[--nw-text-primary]">Description</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[--nw-text-secondary]">
                    {liveTask.description || "No description"}
                  </p>
                </section>
                <RoleGuard allow={["PM"]} fallback={null}>
                  <section className="rounded-md border border-[--nw-border] p-3">
                    <h3 className="text-sm font-semibold text-[--nw-text-primary]">PM controls</h3>
                    <p className="mt-1 text-sm text-[--nw-text-muted]">
                      Title, description, assignee, and client visibility are editable through backend task updates.
                    </p>
                    <div className="mt-3">
                      <AddDependencyModal projectId={projectId} taskId={liveTask.id} />
                    </div>
                  </section>
                </RoleGuard>
                <section>
                  <h3 className="text-sm font-semibold text-[--nw-text-primary]">Dependencies</h3>
                  <div className="mt-2">
                    <DependencyList taskId={liveTask.id} />
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-semibold text-[--nw-text-primary]">Attachments</h3>
                  <div className="mt-2">
                    <AttachmentList attachments={liveTask.attachments} />
                  </div>
                  <RoleGuard allow={["INTERNAL"]} fallback={null}>
                    <div className="mt-3">
                      <UploadAttachmentForm projectId={projectId} taskId={liveTask.id} />
                    </div>
                  </RoleGuard>
                </section>
              </>
            )}
          </div>
          <aside className="space-y-4">
            <div className="rounded-md border border-[--nw-border] p-3">
              <h3 className="text-sm font-semibold text-[--nw-text-primary]">Assignee</h3>
              <p className="mt-1 text-sm text-[--nw-text-secondary]">{liveTask.assignee?.name ?? "Unassigned"}</p>
            </div>
            <div className="rounded-md border border-[--nw-border] p-3">
              <h3 className="mb-3 text-sm font-semibold text-[--nw-text-primary]">Status actions</h3>
              <TaskStatusButton
                dependencies={dependencyQuery.data ?? []}
                projectId={projectId}
                task={liveTask}
              />
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

