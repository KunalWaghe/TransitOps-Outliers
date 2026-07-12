import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/api/client"
import { clearAuthToken, getAuthToken, setAuthToken } from "@/utils/storage"
import { AuthContext, type UserProfile } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(getAuthToken())
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchMe = useCallback(async (authToken: string) => {
    try {
      const response = await apiClient.get<UserProfile>("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setUser(response.data)
    } catch {
      clearAuthToken()
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchMe(token)
    } else {
      setIsLoading(false)
    }
  }, [token, fetchMe])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiClient.post<{ access_token: string; token_type: string }>("/api/auth/login", {
        email,
        password,
      })
      const accessToken = response.data.access_token
      setAuthToken(accessToken)
      setToken(accessToken)
      await fetchMe(accessToken)
      navigate("/", { replace: true })
    },
    [fetchMe, navigate]
  )

  const logout = useCallback(() => {
    clearAuthToken()
    setToken(null)
    setUser(null)
    navigate("/login", { replace: true })
  }, [navigate])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
