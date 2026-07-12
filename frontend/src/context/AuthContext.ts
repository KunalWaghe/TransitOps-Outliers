import { createContext } from "react"

export type UserRole = "fleet_manager" | "dispatcher" | "safety_officer" | "financial_analyst" | "unknown"

export interface UserProfile {
  id: number
  email: string
  name: string
  role: UserRole
}

export interface AuthContextValue {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
