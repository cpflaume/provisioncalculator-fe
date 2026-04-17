import { createContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, getMe } from "@/api/auth"

export interface AuthUser {
  userId: number
  email: string
  displayName: string
  role: "ADMIN" | "USER"
  status: "PENDING" | "ACTIVE" | "DISABLED"
  tenantIds: string[]
}

interface AuthContextValue {
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

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      setToken(stored)
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem(TOKEN_KEY))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const onExpired = () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
    }
    window.addEventListener("auth-expired", onExpired)
    return () => window.removeEventListener("auth-expired", onExpired)
  }, [])

  const login = async (email: string, password: string) => {
    const { token: t, user: u } = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
  }

  const register = async (email: string, password: string, displayName: string) => {
    const { token: t, user: u } = await apiRegister(email, password, displayName)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
