import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarContent } from "./SidebarContent"
import { SidebarFooter } from "./SidebarFooter"
import { SidebarCollapseButton } from "./SidebarCollapseButton"
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./constants"

export function Sidebar() {
  const { sidebarCollapsed } = useSidebar()
  const width = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden",
        "bg-[var(--brand-surface)] border-r border-[var(--brand-hairline)]",
        "transition-[width] duration-200 ease-in-out"
      )}
      style={{ width }}
      aria-label="Application sidebar"
    >
      <SidebarHeader />
      <SidebarContent />
      <SidebarCollapseButton />
      <SidebarFooter />
    </aside>
  )
}
