import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  message?: string
  className?: string
}

export function EmptyState({ title = "No data yet", message = "Records will appear here once added.", className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-[var(--space-xxl)] text-[var(--brand-ink-muted)]", className)}>
      <Inbox size={40} className="mb-[var(--space-sm)] opacity-50" />
      <p className="font-medium text-[var(--brand-ink)]" style={{ fontSize: "var(--text-body-md)" }}>
        {title}
      </p>
      <p className="mt-1" style={{ fontSize: "var(--text-body-sm)" }}>
        {message}
      </p>
    </div>
  )
}
