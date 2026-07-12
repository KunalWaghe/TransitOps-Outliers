import { useMatches, Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface MatchWithHandle {
  pathname: string
  handle?: { crumb?: string }
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
                className="text-[var(--brand-ink-faint)]"
                aria-hidden="true"
              />
            )}
            {i < crumbs.length - 1 ? (
              <Link
                to={match.pathname}
                className="transition-colors hover:text-[var(--brand-ink)] text-[var(--brand-ink-muted)]"
                style={{
                  fontSize: "var(--text-caption)",
                  lineHeight: "var(--leading-caption)",
                }}
              >
                {match.handle!.crumb}
              </Link>
            ) : (
              <span
                className="font-medium text-[var(--brand-ink)]"
                style={{
                  fontSize: "var(--text-caption)",
                  lineHeight: "var(--leading-caption)",
                }}
                aria-current="page"
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
