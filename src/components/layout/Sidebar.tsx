"use client"

import { BarChart3, FolderKanban, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"

const linksByRole = {
  PM: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
  ],
  INTERNAL: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "My Tasks", icon: FolderKanban },
  ],
  CLIENT_GUEST: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client", label: "My Project", icon: BarChart3 },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const links = user ? linksByRole[user.role] : []

  return (
    <aside className="border-[var(--nw-border)] bg-[var(--nw-surface)]/95 text-[var(--nw-text-primary)] md:min-h-screen md:w-[214px] md:border-r">
      <div className="flex h-16 items-center border-b border-[var(--nw-border)] px-5">
        <div className="border-l border-[var(--nw-border)] pl-3">
          <p className="text-[15px] font-semibold tracking-[0.08em] uppercase">NodeWave</p>
          <p className="mt-0.5 text-[11px] text-[var(--nw-text-muted)]">Workspace</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 py-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              className={cn(
                "flex min-w-fit items-center gap-3 border-l border-transparent px-4 py-3 text-[13px] font-medium text-[var(--nw-text-secondary)] transition hover:border-[var(--nw-border)] hover:bg-[var(--nw-primary-light)] hover:text-[var(--nw-text-primary)]",
                active && "border-[var(--nw-primary)] bg-[var(--nw-primary-light)] text-[var(--nw-text-primary)]"
              )}
              href={link.href}
              key={link.href}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
