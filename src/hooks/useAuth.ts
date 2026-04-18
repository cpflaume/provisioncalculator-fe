import { useContext } from "react"
import { AuthContext } from "@/context/auth-context-def"

export function useAuth() {
  return useContext(AuthContext)
}
