import { NAV_GROUPS } from "./constants"
import { SidebarGroup } from "./SidebarGroup"

interface SidebarContentProps {
  onItemClick?: () => void
}

export function SidebarContent({ onItemClick }: SidebarContentProps) {
  return (
    <nav
      className="flex-1 overflow-y-auto p-[var(--space-xs)] space-y-[var(--space-sm)]"
      aria-label="Main navigation"
    >
      {NAV_GROUPS.map(group => (
        <SidebarGroup key={group.id} group={group} onItemClick={onItemClick} />
      ))}
    </nav>
  )
}
