import type { ReactNode } from "react"

export interface NavItem {
  id: string
  label: string
  icon: string
  to: string
  badge?: number
}

export interface NavGroup {
  id: string
  label?: string
  items: NavItem[]
}

export interface LayoutContextValue {
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  toggleSidebar: () => void
  openMobileDrawer: () => void
  closeMobileDrawer: () => void
}

export interface AppShellProps {
  children: ReactNode
}
