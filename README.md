# Project Management App

> Frontend client for a collaborative project & task management system built as a Fullstack Engineer technical assessment for NodeWave.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Role-Based UI Behavior](#role-based-ui-behavior)
- [Deployment](#deployment)

---

## Overview

This is the frontend client for a project and task management system, purpose-built for a medium-to-large multi-discipline team (Product Management, UI/UX, Frontend, Backend) and their clients. The UI enforces role-aware interactions - action buttons are locked or hidden based on the user's role, department, and the current task state - mirroring the access control logic enforced on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 + Radix UI / shadcn/ui |
| Data Fetching | TanStack Query v5 + Axios |
| Global State | Zustand v5 |
| Forms | React Hook Form + Zod |
| Linting & Format | Biome |
| Git Hooks | Husky + Commitlint |

---

## Features

### Core

- **Authentication** - Register, Login, Logout with JWT. Protected routes redirect unauthenticated users to `/login`
- **Project Board** - View all projects visible to the current user (role-filtered)
- **Task Board** - Kanban-style view with columns: `Blocked`, `To Do`, `In Progress`, `Done`
- **Dependency-Aware Task Cards** - Blocked tasks visually indicate which prerequisite tasks are incomplete
- **State-Based Action Locking** - "Start Task" and "Complete Task" buttons are disabled with a tooltip when the user lacks permission based on their role, department, or unresolved dependencies
- **Attachment Upload** - Internal team members can upload work attachments to tasks they're assigned to
- **Audit Trail View** - PMs can view the full field-level change history of any task

### Per-Role UI

| Feature | PM | Internal Team | Client Guest |
|---|---|---|---|
| Create/Edit Project | ✅ | ❌ | ❌ |
| Create Task | ✅ | ❌ | ❌ |
| Define Dependencies | ✅ | ❌ | ❌ |
| Edit Task Description | ✅ | ❌ | ❌ |
| Change Task Status | ✅ (except → Done) | ✅ (own tasks, ABAC) | ❌ |
| Upload Attachments | ❌ | ✅ | ❌ |
| View Audit Trail | ✅ | ❌ | ❌ |
| View Project Metrics | ✅ | ✅ | ✅ (own project only) |
| See Internal Identities | ✅ | ✅ | ❌ (masked at API) |

---

## Getting Started

### Prerequisites

- Node.js `>= 20` or Bun `>= 1.0`
- A running instance of the [backend API](https://github.com/Rcikaym/jira-wanna-be-backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rcikaym/jira-wanna-be-frontend
cd jira-wanna-be-frontend

# Install dependencies
bun install
# or
npm install

# Start the development server
bun dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BE_URL=http://localhost:3001
```

For production, point this to your deployed backend URL.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── projects/
│   │   │   ├── page.tsx         # Project list
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Project detail + task board
│   │   │       └── tasks/
│   │   │           └── [taskId]/
│   │   │               └── page.tsx  # Task detail + audit log
│   │   └── layout.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── task/               # TaskCard, TaskStatusBadge, DependencyChip
│   ├── project/            # ProjectCard, ProjectMetrics
│   └── shared/             # Guards, Loading, Empty, Error states
├── hooks/                  # Custom TanStack Query hooks (useProjects, useTasks, etc.)
├── lib/
│   ├── axios.ts            # Axios instance with JWT interceptor
│   ├── zod/                # Shared Zod schemas
│   └── utils.ts
├── store/                  # Zustand stores (auth, ui)
└── types/                  # Shared TypeScript types & API response shapes
```

---

## Role-Based UI Behavior

### State-Based Button Locking

The "Move to In Progress" button on a task card reflects dependency state in real time:

```tsx
// Example: button is disabled if task is Blocked
<Button
  disabled={task.status === 'BLOCKED' || !canChangeStatus}
  title={task.status === 'BLOCKED' ? 'Unresolved dependencies' : undefined}
  onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
>
  Start Task
</Button>
```

The `canChangeStatus` flag is derived from the user's role and department, computed client-side from the JWT payload - but the API will also reject unauthorized status changes independently.

### Optimistic Updates + Conflict Handling

TanStack Query is configured with optimistic updates for status changes. If the backend returns a `409 Conflict` (optimistic locking violation), the UI:

1. Rolls back the optimistic update
2. Re-fetches the latest task data
3. Displays a toast notification: *"This task was updated by someone else. Please review the changes."*

### Client Guest View

When the authenticated user has the `CLIENT_GUEST` role, the app renders a simplified read-only dashboard:

- Only their assigned project is accessible
- Only `client_visible` tasks are shown
- All internal identity fields (assignee names, avatars, departments, internal comments) are absent from the API response and therefore never reach the UI

---

## UI States

All list and data views implement the full set of UI states:

| State | Implementation |
|---|---|
| **Loading** | Skeleton components (matches layout of loaded content) |
| **Empty** | Illustrated empty state with contextual call-to-action |
| **Error** | Error boundary with retry button and error message |
| **Optimistic** | Instant UI feedback before server confirmation |

---

## Deployment

The frontend is deployed at: **`https://jira-wanna-be-frontend.vercel.app`**

Deployed on [Vercel](https://vercel.com/), pointed at the live backend via `NEXT_PUBLIC_BE_URL`.

### Build

```bash
bun run build
# or
npm run build
```

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dependency chip to blocked task cards
fix: roll back optimistic update on 409 conflict
chore: configure biome rules
refactor: extract useTaskStatus hook
```

Enforced via **Commitlint** + **Husky** pre-commit hooks.
