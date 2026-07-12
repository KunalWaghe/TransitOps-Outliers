import { Link, useMatches } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface RouteHandle {
  crumb?: string
}

interface MatchWithHandle {
  pathname: string
  handle?: RouteHandle
}

export function Breadcrumbs() {
  const matches = useMatches() as MatchWithHandle[]
  const crumbs = matches.filter(m => m.handle?.crumb)

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {crumbs.map((match, i) => (
          <li key={match.pathname} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                size={12}
                aria-hidden="true"
                className="text-[var(--brand-ink-faint)]"
              />
            )}
            {i < crumbs.length - 1 ? (
              <Link
                to={match.pathname}
                className="text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)] transition-colors"
                style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}
              >
                {match.handle!.crumb}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="font-medium text-[var(--brand-ink)]"
                style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}
              >
                {match.handle!.crumb}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
