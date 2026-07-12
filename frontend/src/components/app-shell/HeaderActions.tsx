import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-[var(--space-xs)]">
      <button
        type="button"
        aria-label="Notifications"
        className={cn(
          "w-8 h-8 rounded-[var(--radius-full)] flex items-center justify-center",
          "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        )}
      >
        <Bell size={17} aria-hidden="true" />
      </button>
      <div
        className="w-8 h-8 rounded-[var(--radius-full)] bg-[var(--brand-canvas-soft)]
          border border-[var(--brand-hairline)] flex items-center justify-center
          font-semibold text-[var(--brand-ink-muted)] shrink-0 select-none"
        style={{ fontSize: "var(--text-eyebrow)" }}
        aria-label="User avatar"
      >
        A
      </div>
    </div>
  )
}
