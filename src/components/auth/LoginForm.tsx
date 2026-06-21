"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { api } from "@/lib/axios"
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
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      const response = await api.post<ApiResponse<LoginData>>("/auth/login", values)
      const { user, token } = response.data.data
      login(user, token)
      document.cookie = `nw-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
      router.push("/dashboard")
    } catch (error) {
      setFormError(axios.isAxiosError(error) && error.response?.status === 401 ? "Invalid email or password" : "Could not sign in")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text-[--nw-text-primary]" htmlFor="email">
          Email
        </label>
        <input
          className="mt-1 h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm outline-none focus:border-[--nw-primary]"
          id="email"
          type="email"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-[--nw-danger]">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-[--nw-text-primary]" htmlFor="password">
          Password
        </label>
        <input
          className="mt-1 h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm outline-none focus:border-[--nw-primary]"
          id="password"
          type="password"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-[--nw-danger]">{errors.password.message}</p>}
      </div>
      {formError && <p className="text-sm text-[--nw-danger]">{formError}</p>}
      <button
        className="flex h-10 w-full items-center justify-center rounded-md bg-[--nw-primary] text-sm font-medium text-white hover:bg-[--nw-primary-hover] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign in"}
      </button>
      <p className="text-center text-sm text-[--nw-text-secondary]">
        Need an account?{" "}
        <Link className="font-medium text-[--nw-primary]" href="/register">
          Register
        </Link>
      </p>
    </form>
  )
}

