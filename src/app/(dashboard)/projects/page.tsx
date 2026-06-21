"use client"

import { useMemo, useState } from "react"
import { RoleGuard } from "@/components/layout/RoleGuard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { ProjectList } from "@/components/projects/ProjectList"
import { SearchInput } from "@/components/shared/SearchInput"
import type { EzFilterParams } from "@/lib/serialiseFilters"
import { useAuthStore } from "@/store/auth.store"

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)
  const params: EzFilterParams = useMemo(
    () => ({
      page,
      rows,
      searchFilters: search ? { name: search } : undefined,
      orderKey: "createdAt",
      orderRule: "desc",
    }),
    [page, rows, search]
  )

  return (
    <RoleGuard allow={["PM", "INTERNAL"]}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[--nw-text-primary]">
              {user?.role === "INTERNAL" ? "My Tasks" : "Projects"}
            </h1>
            <p className="mt-1 text-sm text-[--nw-text-secondary]">
              {user?.role === "INTERNAL" ? "Projects scoped to your assignments." : "Manage client projects and delivery boards."}
            </p>
          </div>
          <RoleGuard allow={["PM"]} fallback={null}>
            <CreateProjectModal />
          </RoleGuard>
        </div>
        <SearchInput
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Search projects"
          value={search}
        />
        <ProjectList
          onPageChange={setPage}
          onRowsChange={(value) => {
            setRows(value)
            setPage(1)
          }}
          params={params}
        />
      </div>
    </RoleGuard>
  )
}

