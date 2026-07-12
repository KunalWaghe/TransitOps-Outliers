import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export function Card({ children, className, padding = "md" }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-[var(--space-sm)]",
    md: "p-[var(--space-md)]",
    lg: "p-[var(--space-lg)]",
  }

  return (
    <div
      className={cn(
        "bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)]",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
