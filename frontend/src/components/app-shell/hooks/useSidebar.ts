import { useLayoutContext } from "../AppShellProvider"

export function useSidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileDrawerOpen,
    openMobileDrawer,
    closeMobileDrawer,
  } = useLayoutContext()

  return {
    sidebarCollapsed,
    toggleSidebar,
    mobileDrawerOpen,
    openMobileDrawer,
    closeMobileDrawer,
  }
}
