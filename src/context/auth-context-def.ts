import { createContext } from "react"

export interface AuthUser {
  userId: number
  email: string
  displayName: string
  role: "ADMIN" | "USER"
  status: "PENDING" | "ACTIVE" | "DISABLED"
  tenantIds: string[]
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})
