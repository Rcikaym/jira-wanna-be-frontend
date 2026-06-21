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
    <aside className="border-[--nw-border] bg-[--nw-secondary] text-white md:min-h-screen md:w-64 md:border-r">
      <div className="flex h-16 items-center px-5 text-lg font-semibold">NodeWave</div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              className={cn(
                "flex min-w-fit items-center gap-2 rounded-md border-l-4 border-transparent px-3 py-2 text-sm text-white/75 transition",
                active && "border-[--nw-primary] bg-[--nw-primary-light] text-[--nw-primary]"
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

