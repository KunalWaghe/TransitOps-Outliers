import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4", className)}>
      <div>
        <h1
          className="font-bold text-[var(--brand-ink)]"
          style={{
            fontSize: "var(--text-heading-2)",
            lineHeight: "var(--leading-heading-2)",
            letterSpacing: "var(--tracking-heading-2)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-[var(--space-xxs)] text-[var(--brand-ink-muted)]"
            style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-[var(--space-xs)]">{children}</div>}
    </div>
  )
}
