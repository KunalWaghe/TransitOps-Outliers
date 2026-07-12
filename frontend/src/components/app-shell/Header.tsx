import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"
import { Breadcrumbs } from "./Breadcrumbs"
import { HeaderActions } from "./HeaderActions"

export function Header() {
  const { openMobileDrawer } = useSidebar()

  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center justify-between",
        "px-[var(--space-md)] md:px-[var(--space-lg)]",
        "bg-[var(--brand-surface)] border-b border-[var(--brand-hairline)]",
        "sticky top-0 z-10"
      )}
    >
      <div className="flex items-center gap-[var(--space-sm)]">
        <button
          type="button"
          onClick={openMobileDrawer}
          aria-label="Open navigation menu"
          className={cn(
            "md:hidden w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center",
            "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)]",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          )}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <Breadcrumbs />
      </div>
      <HeaderActions />
    </header>
  )
}
