"use client"

import { Plus, X } from "lucide-react"
import { useState } from "react"
import { useCreateTask } from "@/hooks/useTasks"

export function CreateTaskModal({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { mutate, isPending } = useCreateTask(projectId)

  return (
    <>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-md bg-[--nw-primary] px-3 text-sm font-medium text-white hover:bg-[--nw-primary-hover]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus className="h-4 w-4" />
        New task
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-lg rounded-lg bg-[--nw-surface] p-5 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault()
              mutate(
                { title, description },
                {
                  onSuccess: () => {
                    setOpen(false)
                    setTitle("")
                    setDescription("")
                  },
                }
              )
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[--nw-text-primary]">Create task</h2>
              <button onClick={() => setOpen(false)} type="button">
                <X className="h-5 w-5 text-[--nw-text-muted]" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                className="h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Task title"
                required
                value={title}
              />
              <textarea
                className="min-h-28 w-full rounded-md border border-[--nw-border] px-3 py-2 text-sm"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                value={description}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="h-9 rounded-md border border-[--nw-border] px-3 text-sm" onClick={() => setOpen(false)} type="button">
                Cancel
              </button>
              <button className="h-9 rounded-md bg-[--nw-primary] px-3 text-sm font-medium text-white" disabled={isPending} type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

