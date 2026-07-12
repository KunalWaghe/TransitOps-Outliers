import { Bus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./hooks/useSidebar"

export function SidebarHeader() {
  const { sidebarCollapsed } = useSidebar()

  return (
    <div
      className={cn(
        "flex items-center h-14 shrink-0",
        "border-b border-[var(--brand-hairline)]",
        sidebarCollapsed ? "justify-center px-0" : "gap-2 px-[var(--space-md)]"
      )}
    >
      <div
        className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--brand-primary)]
          flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Bus size={15} className="text-white" />
      </div>
      {!sidebarCollapsed && (
        <span
          className="font-semibold text-[var(--brand-ink)] truncate"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-title)",
            letterSpacing: "var(--tracking-title)",
          }}
        >
          TransitOps
        </span>
      )}
    </div>
  )
}
