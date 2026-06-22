"use client"

import { RoleGuard } from "@/components/layout/RoleGuard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { ProjectList } from "@/components/projects/ProjectList"
import { SearchInput } from "@/components/shared/SearchInput"
import { useQueryParams } from "@/hooks/useQueryParams"
import { useAuthStore } from "@/store/auth.store"

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user)
  
  const {
    params: queryParams,
    setSearch,
    clearSearch,
    setPage,
    setRows,
  } = useQueryParams({
    defaultRows: 10,
    defaultOrderKey: "createdAt",
    defaultOrderRule: "desc",
  })

  return (
    <RoleGuard allow={["PM", "INTERNAL"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-(--nw-border) pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="border-l border-(--nw-primary) pl-4">
            <h1 className="text-2xl font-semibold text-(--nw-text-primary)">
              {user?.role === "INTERNAL" ? "My Tasks" : "Projects"}
            </h1>
            <p className="mt-2 max-w-xl text-step-1 leading-6 text-(--nw-text-secondary)">
              {user?.role === "INTERNAL" ? "Projects scoped to your assignments." : "Manage client projects and delivery boards."}
            </p>
          </div>
          <RoleGuard allow={["PM"]} fallback={null}>
            <CreateProjectModal />
          </RoleGuard>
        </div>
        <SearchInput
          onSearch={(value) => {
            if (value) {
              setSearch({ name: value })
            } else {
              clearSearch()
            }
          }}
          placeholder="Search projects"
          defaultValue={queryParams.searchFilters?.name as string ?? ""}
        />
        <ProjectList
          onPageChange={setPage}
          onRowsChange={setRows}
          params={queryParams}
        />
      </div>
    </RoleGuard>
  )
}
