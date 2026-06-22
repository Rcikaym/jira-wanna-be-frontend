"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthStore } from "@/store/auth.store"
import type { ApiResponse } from "@/types/api"
import type { AuthUser } from "@/types/auth"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof schema>
type LoginData = { user: AuthUser; token: string }

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      const response = await axios.post<ApiResponse<LoginData>>(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/login`,
        values
      )
      const { user, token } = response.data.data
      login(user, token)
      document.cookie = `nw-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
      router.push("/dashboard")
    } catch (error) {
      setFormError(
        axios.isAxiosError(error) && error.response?.status === 401
          ? "Invalid email or password"
          : "Could not sign in"
      )
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-[var(--nw-text-secondary)] uppercase" htmlFor="email">
          Email
        </label>
        <input
          className="h-10 w-full rounded-md border border-[var(--nw-border)] px-3 text-[13px] text-[var(--nw-text-primary)] outline-none transition-colors focus:border-[var(--nw-primary)]"
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="mt-1.5 text-xs text-[var(--nw-danger)]">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-[var(--nw-text-secondary)] uppercase" htmlFor="password">
          Password
        </label>
        <input
          className="h-10 w-full rounded-md border border-[var(--nw-border)] px-3 text-[13px] text-[var(--nw-text-primary)] outline-none transition-colors focus:border-[var(--nw-primary)]"
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && <p className="mt-1.5 text-xs text-[var(--nw-danger)]">{errors.password.message}</p>}
      </div>
      {formError && <p className="text-xs text-[var(--nw-danger)]">{formError}</p>}
      <button
        className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--nw-primary)] text-[13px] font-medium text-[var(--nw-surface)] transition-colors hover:bg-[var(--nw-primary-hover)] disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>Loading</title>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Signing in...</span>
          </span>
        ) : (
          "Sign in"
        )}
      </button>
      <p className="mt-6 text-center text-xs text-[var(--nw-text-secondary)]">
        Need an account?{" "}
        <Link className="font-medium text-[var(--nw-primary)] underline-offset-4 hover:underline" href="/register">
          Register
        </Link>
      </p>
    </form>
  )
}
