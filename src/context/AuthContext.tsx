import { useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, getMe } from "@/api/auth"
import { AuthContext, type AuthUser } from "./auth-context-def"

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  // Start loading only if there is a stored token to validate
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
        })
        .finally(() => setLoading(false))
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
