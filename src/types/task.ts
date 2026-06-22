export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "DONE" | "BLOCKED";

export type Task = {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	isClientVisible: boolean;
	version: number;
	assignee: {
		id: string;
		name: string;
		avatarUrl: string | null;
		department: string | null;
	} | null;
	project: { id: string; name: string };
	attachments: { id: string; fileName: string; fileUrl: string }[];
	createdAt: string;
	updatedAt: string;
};

export type ClientTask = {
	id: string;
	title: string;
	status: TaskStatus;
	project: { id: string; name: string };
	createdAt: string;
	updatedAt: string;
};

export type TaskDependency = {
	id?: string;
	dependsOnTask: {
		id: string;
		title: string;
		status: TaskStatus;
	};
};
