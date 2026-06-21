"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import type { Role } from "@/types/auth"

type Props = {
  allow: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

function RedirectToDashboard() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard")
  }, [router])
  return null
}

export function RoleGuard({ allow, children, fallback }: Props) {
  const { user } = useAuthStore()

  if (!user || !allow.includes(user.role)) {
    if (fallback !== undefined) return <>{fallback}</>
    return <RedirectToDashboard />
  }

  return <>{children}</>
}

