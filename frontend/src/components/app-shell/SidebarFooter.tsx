import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"
import { useSidebar } from "./hooks/useSidebar"

export function SidebarFooter() {
  const { sidebarCollapsed } = useSidebar()
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div
      className={cn(
        "shrink-0 border-t border-[var(--brand-hairline)]",
        "p-[var(--space-sm)]"
      )}
    >
      <button
        type="button"
        onClick={toggleTheme}
        title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "flex items-center gap-3 w-full rounded-[var(--radius-sm)] transition-colors duration-150",
          "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
          sidebarCollapsed
            ? "justify-center mx-1 p-2"
            : "px-[var(--space-md)] py-[var(--space-sm)]"
        )}
      >
        {resolvedTheme === "dark" ? (
          <Sun size={16} className="shrink-0" aria-hidden="true" />
        ) : (
          <Moon size={16} className="shrink-0" aria-hidden="true" />
        )}
        {!sidebarCollapsed && (
          <span style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}>
            {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        )}
      </button>
    </div>
  )
}
