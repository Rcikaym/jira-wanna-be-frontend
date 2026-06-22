import type { Department, Role } from "@/types/auth";

export type UserOption = {
	id: string;
	name: string;
	email: string;
	role: Role;
	department: Department | null;
};
