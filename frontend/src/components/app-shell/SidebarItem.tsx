import { NavLink } from "react-router-dom"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"
import type { NavItem } from "./types"

interface SidebarItemProps {
  item: NavItem
  onClick?: () => void
}

export function SidebarItem({ item, onClick }: SidebarItemProps) {
  const { sidebarCollapsed } = useSidebar()
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onClick}
      title={sidebarCollapsed ? item.label : undefined}
      aria-label={sidebarCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-[var(--radius-sm)] transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
          sidebarCollapsed
            ? "justify-center mx-1 p-2"
            : "px-[var(--space-md)] py-[var(--space-sm)]",
          isActive
            ? "bg-[var(--brand-primary)] text-white"
            : "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]"
        )
      }
    >
      {({ isActive }) => (
        <>
          <IconComponent
            size={18}
            aria-hidden="true"
            className={cn("shrink-0", isActive ? "text-white" : "text-[var(--brand-ink-muted)]")}
          />
          {!sidebarCollapsed && (
            <span
              className="truncate"
              style={{
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
              }}
            >
              {item.label}
            </span>
          )}
          {!sidebarCollapsed && item.badge != null && item.badge > 0 && (
            <span
              className="ml-auto font-semibold rounded-[var(--radius-full)]
                bg-[var(--brand-primary)] text-white px-[var(--space-xxs)] py-px"
              style={{ fontSize: "var(--text-eyebrow)", lineHeight: 1 }}
              aria-label={`${item.badge} items`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
