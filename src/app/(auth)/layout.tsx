"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthStore } from "@/store/auth.store"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state._hasHydrated)

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated || isAuthenticated) {
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--nw-background) p-4">
      <section className="w-full max-w-102 border border-(--nw-border) bg-(--nw-surface) p-8">
        <div className="mb-8 border-l border-(--nw-primary) pl-4">
          <span className="text-[11px] font-semibold tracking-[0.16em] text-(--nw-text-muted) uppercase">NodeWave</span>
          <p className="mt-1 text-xl font-semibold text-(--nw-text-primary)">Enter the workspace</p>
        </div>
        {children}
      </section>
    </main>
  )
}
