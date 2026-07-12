import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { LayoutContextValue } from "./types"
import { SIDEBAR_STORAGE_KEY } from "./constants"

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed))
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [sidebarCollapsed])

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), [])
  const openMobileDrawer = useCallback(() => setMobileDrawerOpen(true), [])
  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), [])

  return (
    <LayoutContext.Provider
      value={{ sidebarCollapsed, mobileDrawerOpen, toggleSidebar, openMobileDrawer, closeMobileDrawer }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutContext(): LayoutContextValue {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error("useLayoutContext must be used inside AppShellProvider")
  return ctx
}
