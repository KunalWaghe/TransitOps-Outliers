import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"
import { SidebarItem } from "./SidebarItem"
import type { NavGroup } from "./types"

interface SidebarGroupProps {
  group: NavGroup
  onItemClick?: () => void
}

export function SidebarGroup({ group, onItemClick }: SidebarGroupProps) {
  const { sidebarCollapsed } = useSidebar()

  return (
    <div className="space-y-0.5">
      {group.label && !sidebarCollapsed && (
        <p
          className={cn(
            "px-[var(--space-md)] pb-[var(--space-xxs)] pt-[var(--space-sm)]",
            "font-semibold uppercase text-[var(--brand-ink-faint)]"
          )}
          style={{
            fontSize: "var(--text-eyebrow)",
            lineHeight: "var(--leading-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
          }}
        >
          {group.label}
        </p>
      )}
      {group.items.map(item => (
        <SidebarItem key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  )
}
