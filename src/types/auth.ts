export type Role = "PM" | "INTERNAL" | "CLIENT_GUEST"
export type Department = "UI_UX" | "FRONTEND" | "BACKEND"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
  department: Department | null
}

export type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

