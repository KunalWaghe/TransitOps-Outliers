import { Bell, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

export function HeaderActions() {
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A"

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

      <button
        type="button"
        onClick={logout}
        aria-label="Sign out"
        className={cn(
          "w-8 h-8 rounded-[var(--radius-full)] flex items-center justify-center",
          "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        )}
      >
        <LogOut size={17} aria-hidden="true" />
      </button>

      <div
        aria-label="User avatar"
        className={cn(
          "w-8 h-8 rounded-[var(--radius-full)] shrink-0",
          "bg-[var(--brand-canvas-soft)] border border-[var(--brand-hairline)]",
          "flex items-center justify-center",
          "font-semibold text-[var(--brand-ink-muted)]"
        )}
        style={{ fontSize: "var(--text-eyebrow)" }}
      >
        {initials}
      </div>
    </div>
  )
}
