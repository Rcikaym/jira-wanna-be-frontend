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
    <header className="flex h-16 items-center justify-between border-b border-[var(--nw-border)] bg-[var(--nw-background)]/85 px-4 backdrop-blur md:px-6">
      <div>
        <p className="text-[13px] font-medium text-[var(--nw-text-primary)]">{user?.name ?? "NodeWave"}</p>
        {user && (
          <span className="mt-1 inline-flex border-l border-[var(--nw-primary)] pl-2 font-mono text-[11px] text-[var(--nw-text-muted)]">
            {user.role}
          </span>
        )}
      </div>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--nw-border)] bg-[var(--nw-surface)] px-3 text-[13px] text-[var(--nw-text-primary)] transition hover:border-[var(--nw-primary)]"
        onClick={handleLogout}
        type="button"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </header>
  )
}
