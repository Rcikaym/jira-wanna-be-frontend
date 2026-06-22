"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type UseFormRegisterReturn, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Enter a valid email"),
		password: z.string().min(8, "Minimum 8 characters"),
		role: z.enum(["PM", "INTERNAL", "CLIENT_GUEST"]),
		department: z
			.preprocess(
				(val) => (val === "" ? undefined : val),
				z.enum(["UI_UX", "FRONTEND", "BACKEND"]),
			)
			.optional(),
	})
	.refine(
		(data) => {
			if (data.role === "INTERNAL") return !!data.department;
			return true;
		},
		{
			message: "Department is required for Internal team members",
			path: ["department"],
		},
	);

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
	const router = useRouter();
	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		setValue,
	} = useForm<FormValues>({
		resolver: zodResolver(schema) as any,
		mode: "onChange",
		defaultValues: { role: "INTERNAL" },
	});
	const role = useWatch({ control, name: "role" });

	useEffect(() => {
		if (role !== "INTERNAL") {
			setValue("department", undefined);
		}
	}, [role, setValue]);

	async function onSubmit(values: FormValues) {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_BE_URL}/auth/register`,
				values,
			);
			toast.success("Account created. You can sign in now.");
			router.push("/login");
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data?.error) {
				toast.error(error.response.data.error);
			} else {
				toast.error("Could not create account");
			}
		}
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<Input
				label="Name"
				error={errors.name?.message}
				registration={register("name")}
				autoComplete="name"
			/>
			<Input
				label="Email"
				error={errors.email?.message}
				registration={register("email")}
				type="email"
				autoComplete="email"
			/>
			<Input
				label="Password"
				error={errors.password?.message}
				registration={register("password")}
				type="password"
				autoComplete="new-password"
			/>
			<div>
				<label
					className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-(--nw-text-secondary) uppercase"
					htmlFor="role"
				>
					Role
				</label>
				<select
					className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 text-(--nw-text-primary) outline-none transition-colors focus:border-(--nw-primary)"
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
					<label
						className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-(--nw-text-secondary) uppercase"
						htmlFor="department"
					>
						Department
					</label>
					<select
						className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 text-(--nw-text-primary) outline-none transition-colors focus:border-(--nw-primary)"
						id="department"
						{...register("department")}
					>
						<option value="">Select department</option>
						<option value="UI_UX">UI/UX</option>
						<option value="FRONTEND">Frontend</option>
						<option value="BACKEND">Backend</option>
					</select>
					{errors.department && (
						<p className="mt-1.5 text-xs text-(--nw-danger)">
							{errors.department.message}
						</p>
					)}
				</div>
			)}
			<button
				className="flex h-10 w-full items-center justify-center rounded-md bg-(--nw-primary) text-step-1 font-medium text-(--nw-surface) transition-colors hover:bg-(--nw-primary-hover) disabled:opacity-50"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? (
					<span className="flex items-center gap-2">
						<svg
							className="animate-spin h-4 w-4 text-white"
							fill="none"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Loading</title>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<span>Creating account...</span>
					</span>
				) : (
					"Create account"
				)}
			</button>
			<p className="mt-6 text-center text-xs text-(--nw-text-secondary)">
				Already registered?{" "}
				<Link
					className="font-medium text-(--nw-primary) underline-offset-4 hover:underline"
					href="/login"
				>
					Sign in
				</Link>
			</p>
		</form>
	);
}

function Input({
	error,
	label,
	registration,
	type = "text",
	autoComplete,
}: {
	error?: string;
	label: string;
	registration: UseFormRegisterReturn;
	type?: string;
	autoComplete?: string;
}) {
	const id = label.toLowerCase();
	return (
		<div>
			<label
				className="mb-1.5 block text-[11px] font-medium tracking-[0.08em] text-(--nw-text-secondary) uppercase"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				className="h-10 w-full rounded-md border border-(--nw-border) px-3 text-step-1 text-(--nw-text-primary) outline-none transition-colors focus:border-(--nw-primary)"
				id={id}
				type={type}
				autoComplete={autoComplete}
				{...registration}
			/>
			{error && <p className="mt-1.5 text-xs text-(--nw-danger)">{error}</p>}
		</div>
	);
}
