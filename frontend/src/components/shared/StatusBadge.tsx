import { cn } from "@/lib/utils"

export type StatusVariant = "available" | "active" | "in_use" | "in_maintenance" | "completed" | "delayed" | "draft" | "dispatched" | "cancelled" | "warning" | "error" | "success" | "neutral"

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  available: "bg-[#102b1c]/10 text-[#4ade80] border-[#1b432a]/20",
  active: "bg-[#102b1c]/10 text-[#4ade80] border-[#1b432a]/20",
  in_use: "bg-[#a8c8ff]/10 text-[#a8c8ff] border-[#a8c8ff]/20",
  in_maintenance: "bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/20",
  completed: "bg-[#102b1c]/10 text-[#4ade80] border-[#1b432a]/20",
  delayed: "bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/20",
  draft: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  dispatched: "bg-[#a8c8ff]/10 text-[#a8c8ff] border-[#a8c8ff]/20",
  cancelled: "bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/20",
  warning: "bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/20",
  error: "bg-[#dd5b00]/10 text-[#dd5b00] border-[#dd5b00]/20",
  success: "bg-[#102b1c]/10 text-[#4ade80] border-[#1b432a]/20",
  neutral: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
}

const dotColors: Record<StatusVariant, string> = {
  available: "bg-[#4ade80]",
  active: "bg-[#4ade80]",
  in_use: "bg-[#a8c8ff]",
  in_maintenance: "bg-[#dd5b00]",
  completed: "bg-[#4ade80]",
  delayed: "bg-[#dd5b00]",
  draft: "bg-[var(--muted-foreground)]",
  dispatched: "bg-[#a8c8ff]",
  cancelled: "bg-[#dd5b00]",
  warning: "bg-[#dd5b00]",
  error: "bg-[#dd5b00]",
  success: "bg-[#4ade80]",
  neutral: "bg-[var(--muted-foreground)]",
}

export function StatusBadge({ status, variant = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] border text-[11px] font-medium uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      {status}
    </span>
  )
}
