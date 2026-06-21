"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { api } from "@/lib/axios"

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8, "Minimum 8 characters"),
    role: z.enum(["PM", "INTERNAL", "CLIENT_GUEST"]),
    department: z.enum(["UI_UX", "FRONTEND", "BACKEND"]).optional(),
  })
  .refine(
    (data) => {
      if (data.role === "INTERNAL") return !!data.department
      return true
    },
    { message: "Department is required for Internal team members", path: ["department"] }
  )

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const router = useRouter()
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "INTERNAL" },
  })
  const role = useWatch({ control, name: "role" })

  async function onSubmit(values: FormValues) {
    try {
      await api.post("/auth/register", values)
      toast.success("Account created. You can sign in now.")
      router.push("/login")
    } catch {
      toast.error("Could not create account")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" error={errors.name?.message} registration={register("name")} />
      <Input label="Email" error={errors.email?.message} registration={register("email")} type="email" />
      <Input label="Password" error={errors.password?.message} registration={register("password")} type="password" />
      <div>
        <label className="text-sm font-medium text-[--nw-text-primary]" htmlFor="role">
          Role
        </label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm"
          id="role"
          {...register("role")}
        >
          <option value="PM">Project Manager</option>
          <option value="INTERNAL">Internal Team</option>
          <option value="CLIENT_GUEST">Client Guest</option>
        </select>
      </div>
      {role === "INTERNAL" && (
        <div>
          <label className="text-sm font-medium text-[--nw-text-primary]" htmlFor="department">
            Department
          </label>
          <select
            className="mt-1 h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm"
            id="department"
            {...register("department")}
          >
            <option value="">Select department</option>
            <option value="UI_UX">UI/UX</option>
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
          </select>
          {errors.department && <p className="mt-1 text-xs text-[--nw-danger]">{errors.department.message}</p>}
        </div>
      )}
      <button
        className="flex h-10 w-full items-center justify-center rounded-md bg-[--nw-primary] text-sm font-medium text-white hover:bg-[--nw-primary-hover] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Create account"}
      </button>
      <p className="text-center text-sm text-[--nw-text-secondary]">
        Already registered?{" "}
        <Link className="font-medium text-[--nw-primary]" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  )
}

function Input({
  error,
  label,
  registration,
  type = "text",
}: {
  error?: string
  label: string
  registration: UseFormRegisterReturn
  type?: string
}) {
  const id = label.toLowerCase()
  return (
    <div>
      <label className="text-sm font-medium text-[--nw-text-primary]" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-1 h-10 w-full rounded-md border border-[--nw-border] px-3 text-sm outline-none focus:border-[--nw-primary]"
        id={id}
        type={type}
        {...registration}
      />
      {error && <p className="mt-1 text-xs text-[--nw-danger]">{error}</p>}
    </div>
  )
}
