import { useState, useEffect, useRef, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, getMe } from "@/api/auth"
import { AuthContext, type AuthUser } from "./auth-context-def"

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  // Start loading only if there is a stored token to validate
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY))
  // Incremented on every explicit auth action so stale getMe() responses are ignored
  const authVersion = useRef(0)

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      const version = authVersion.current
      getMe()
        .then(u => { if (authVersion.current === version) setUser(u) })
        .catch(() => {
          if (authVersion.current === version) {
            localStorage.removeItem(TOKEN_KEY)
            setToken(null)
          }
        })
        .finally(() => { if (authVersion.current === version) setLoading(false) })
    }
  }, [])

  useEffect(() => {
    const onExpired = () => {
      authVersion.current++
      setUser(null)
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
    }
    window.addEventListener("auth-expired", onExpired)
    return () => window.removeEventListener("auth-expired", onExpired)
  }, [])

  const login = async (email: string, password: string) => {
    authVersion.current++
    const { token: t, user: u } = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
    setLoading(false)
  }

  const register = async (email: string, password: string, displayName: string) => {
    authVersion.current++
    const { token: t, user: u } = await apiRegister(email, password, displayName)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
    setLoading(false)
  }

  const logout = () => {
    authVersion.current++
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
