import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-[var(--space-md)]">
      <p
        className="font-bold text-[var(--brand-ink)]"
        style={{ fontSize: "var(--text-heading-2)", lineHeight: "var(--leading-heading-2)" }}
      >
        404
      </p>
      <p
        className="text-[var(--brand-ink-muted)]"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        Page not found
      </p>
      <Link
        to="/"
        className="text-[var(--brand-primary)] hover:underline"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
