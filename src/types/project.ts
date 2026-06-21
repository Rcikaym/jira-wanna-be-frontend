export type Project = {
  id: string
  name: string
  description: string | null
  client: { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

export type ProjectSummary = {
  projectId: string
  projectName: string
  total: number
  percentComplete: number
  byStatus: {
    DONE: number
    IN_PROGRESS: number
    BLOCKED: number
    BACKLOG: number
  }
}

