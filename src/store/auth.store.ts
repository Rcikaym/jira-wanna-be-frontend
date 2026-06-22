import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "@/types/auth"

type AuthStore = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "nw-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "nw-auth",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)

