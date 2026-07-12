import { useEffect, useRef } from "react"
import { X, Bus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"
import { SidebarContent } from "./SidebarContent"
import { SidebarFooter } from "./SidebarFooter"

export function MobileDrawer() {
  const { mobileDrawerOpen, closeMobileDrawer } = useSidebar()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileDrawerOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileDrawer()
    }
    document.addEventListener("keydown", handleKey)
    drawerRef.current?.focus()
    return () => document.removeEventListener("keydown", handleKey)
  }, [mobileDrawerOpen, closeMobileDrawer])

  if (!mobileDrawerOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeMobileDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 left-0 w-64 flex flex-col outline-none",
          "bg-[var(--brand-surface)] border-r border-[var(--brand-hairline)]",
          "shadow-[var(--shadow-2)]"
        )}
      >
        <div
          className="flex items-center justify-between h-14 shrink-0
            px-[var(--space-md)] border-b border-[var(--brand-hairline)]"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--brand-primary)]
                flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Bus size={15} className="text-white" />
            </div>
            <span
              className="font-semibold text-[var(--brand-ink)]"
              style={{
                fontSize: "var(--text-title)",
                lineHeight: "var(--leading-title)",
                letterSpacing: "var(--tracking-title)",
              }}
            >
              TransitOps
            </span>
          </div>
          <button
            type="button"
            onClick={closeMobileDrawer}
            aria-label="Close navigation menu"
            className={cn(
              "w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center",
              "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)]",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            )}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <SidebarContent onItemClick={closeMobileDrawer} />
        <SidebarFooter />
      </div>
    </div>
  )
}
