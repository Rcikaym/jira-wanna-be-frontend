"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard")
  }, [isAuthenticated, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[--nw-background] p-4">
      <section className="w-full max-w-md rounded-lg border border-[--nw-border] bg-[--nw-surface] p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold text-[--nw-secondary]">NodeWave</p>
          <p className="mt-1 text-sm text-[--nw-text-secondary]">Delivery workspace</p>
        </div>
        {children}
      </section>
    </main>
  )
}

