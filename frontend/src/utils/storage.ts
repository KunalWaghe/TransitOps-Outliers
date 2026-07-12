const AUTH_TOKEN_KEY = "transitops_token"

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token: string): boolean {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return true
  } catch {
    return false
  }
}

export function clearAuthToken(): boolean {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return true
  } catch {
    return false
  }
}
