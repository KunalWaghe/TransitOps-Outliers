export function DashboardPage() {
  return (
    <div className="space-y-[var(--space-lg)]">
      <div>
        <h1
          className="font-bold text-[var(--brand-ink)]"
          style={{
            fontSize: "var(--text-heading-2)",
            lineHeight: "var(--leading-heading-2)",
            letterSpacing: "var(--tracking-heading-2)",
          }}
        >
          Dashboard
        </h1>
        <p
          className="mt-[var(--space-xxs)] text-[var(--brand-ink-muted)]"
          style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
        >
          Fleet overview and operational status
        </p>
      </div>

      <div
        className="border-2 border-dashed border-[var(--brand-hairline)] rounded-[var(--radius-lg)]
          p-[var(--space-xxl)] flex items-center justify-center min-h-64"
      >
        <p
          className="text-[var(--brand-ink-faint)]"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          KPI cards and charts will render here (Sprint 3)
        </p>
      </div>
    </div>
  )
}
