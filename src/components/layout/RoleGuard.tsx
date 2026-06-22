"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import type { Role } from "@/types/auth"

type Props = {
  allow: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

function RedirectToDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (pathname !== "/dashboard") {
      router.replace("/dashboard")
    }
  }, [router, pathname])
  return null
}

export function RoleGuard({ allow, children, fallback }: Props) {
  const { user, _hasHydrated } = useAuthStore()

  if (!_hasHydrated) {
    return null // wait for hydration
  }

  if (!user || !allow.includes(user.role)) {
    if (fallback !== undefined) return <>{fallback}</>
    return <RedirectToDashboard />
  }

  return <>{children}</>
}

