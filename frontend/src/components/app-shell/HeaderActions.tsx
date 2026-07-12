import { Bell, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

// Mock avatar using UI Avatars service
const MOCK_AVATAR_SMALL = "https://ui-avatars.com/api/?name=Raven+K&size=96&background=0075de&color=fff&bold=true"

export function HeaderActions() {
  const { logout } = useAuth()

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

      <Link
        to="/settings"
        aria-label="User profile"
        className={cn(
          "w-8 h-8 rounded-[var(--radius-full)] shrink-0",
          "border border-[var(--brand-hairline)]",
          "overflow-hidden",
          "transition-opacity duration-150 hover:opacity-80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        )}
      >
        <img
          src={MOCK_AVATAR_SMALL}
          alt="User profile"
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  )
}
