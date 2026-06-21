"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export function Topbar() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    document.cookie = "nw-token=; path=/; max-age=0"
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[--nw-border] bg-[--nw-surface] px-4 md:px-6">
      <div>
        <p className="text-sm font-medium text-[--nw-text-primary]">{user?.name ?? "NodeWave"}</p>
        {user && (
          <span className="mt-1 inline-flex rounded-full bg-[--nw-primary-light] px-2 py-0.5 text-xs font-medium text-[--nw-primary]">
            {user.role}
          </span>
        )}
      </div>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[--nw-border] px-3 text-sm text-[--nw-text-primary] hover:border-[--nw-primary]"
        onClick={handleLogout}
        type="button"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </header>
  )
}

