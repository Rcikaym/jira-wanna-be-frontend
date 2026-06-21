"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useAuthStore } from "@/store/auth.store"

export default function DashboardPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user?.role === "PM" || user?.role === "INTERNAL") router.replace("/projects")
    if (user?.role === "CLIENT_GUEST") router.replace("/client")
  }, [router, user])

  return <LoadingSpinner />
}

