import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"

export function SidebarCollapseButton() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className="shrink-0 px-[var(--space-sm)] py-[var(--space-xs)]">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!sidebarCollapsed}
        className={cn(
          "flex items-center gap-2 w-full rounded-[var(--radius-sm)] transition-colors duration-150",
          "text-[var(--brand-ink-faint)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink-muted)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
          sidebarCollapsed
            ? "justify-center p-2 mx-1"
            : "px-[var(--space-md)] py-[var(--space-xs)]"
        )}
      >
        {sidebarCollapsed
          ? <PanelLeftOpen size={16} aria-hidden="true" />
          : <PanelLeftClose size={16} aria-hidden="true" />}
        {!sidebarCollapsed && (
          <span
            style={{
              fontSize: "var(--text-caption)",
              lineHeight: "var(--leading-caption)",
            }}
          >
            Collapse
          </span>
        )}
      </button>
    </div>
  )
}
