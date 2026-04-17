import { rawGet, rawPost } from "./client"
import type { AuthUser } from "@/context/AuthContext"

interface AuthResponse {
  token: string
  user: AuthUser
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return rawPost<AuthResponse>("/api/auth/login", { email, password })
}

export function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  return rawPost<AuthResponse>("/api/auth/register", { email, password, displayName })
}

export function getMe(): Promise<AuthUser> {
  return rawGet<AuthUser>("/api/auth/me")
}
