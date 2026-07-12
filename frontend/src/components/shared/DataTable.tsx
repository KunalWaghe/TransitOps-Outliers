import { useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export type SortDirection = "asc" | "desc"

export interface Column<T> {
  key: string
  header: string
  width?: string
  align?: "left" | "right" | "center"
  sortable?: boolean
  sortValue?: (row: T) => string | number | null | undefined
  render: (row: T) => React.ReactNode
}

export interface DefaultSort {
  key: string
  direction: SortDirection
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyMessage?: string
  className?: string
  isLoading?: boolean
  pageSize?: number
  pagination?: boolean
  defaultSort?: DefaultSort
}

function isColumnSortable<T>(col: Column<T>): boolean {
  if (col.sortable === false) return false
  if (col.key === "actions") return false
  if (!col.header.trim()) return false
  return true
}

function getSortValue<T>(row: T, col: Column<T>): string | number | null | undefined {
  if (col.sortValue) return col.sortValue(row)
  const value = (row as Record<string, unknown>)[col.key]
  if (typeof value === "string" || typeof value === "number") return value
  return null
}

function compareValues(a: string | number | null | undefined, b: string | number | null | undefined): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  if (typeof a === "number" && typeof b === "number") {
    return a - b
  }

  const aStr = String(a)
  const bStr = String(b)
  const aDate = Date.parse(aStr)
  const bDate = Date.parse(bStr)
  const aLooksLikeDate = !Number.isNaN(aDate) && /^\d{4}-\d{2}-\d{2}/.test(aStr)
  const bLooksLikeDate = !Number.isNaN(bDate) && /^\d{4}-\d{2}-\d{2}/.test(bStr)

  if (aLooksLikeDate && bLooksLikeDate) {
    return aDate - bDate
  }

  return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" })
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found",
  className,
  isLoading,
  pageSize = 10,
  pagination = true,
  defaultSort,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction ?? "asc")

  const dataKeysString = data.map(keyExtractor).join(",")
  useEffect(() => {
    setCurrentPage(1)
  }, [dataKeysString, sortKey, sortDirection])

  const sortedData = useMemo(() => {
    if (!sortKey) return data

    const column = columns.find(col => col.key === sortKey)
    if (!column || !isColumnSortable(column)) return data

    return [...data].sort((a, b) => {
      const comparison = compareValues(getSortValue(a, column), getSortValue(b, column))
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [columns, data, sortDirection, sortKey])

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key)
    if (!column || !isColumnSortable(column)) return

    if (sortKey === key) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection("asc")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[var(--space-xl)] text-[var(--brand-ink-muted)]">
        <p style={{ fontSize: "var(--text-body-sm)" }}>Loading...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-[var(--space-xl)] text-[var(--brand-ink-muted)]">
        <p style={{ fontSize: "var(--text-body-sm)" }}>{emptyMessage}</p>
      </div>
    )
  }

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const activePage = Math.min(currentPage, totalPages) || 1
  const startIndex = (activePage - 1) * pageSize
  const paginatedData = pagination ? sortedData.slice(startIndex, startIndex + pageSize) : sortedData

  function getPageNumbers(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = []
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    if (current > 3) {
      pages.push("...")
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push("...")
    }

    pages.push(total)

    return pages
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {columns.map(col => {
                const sortable = isColumnSortable(col)
                const isActive = sortKey === col.key

                return (
                  <th
                    key={col.key}
                    className={cn(
                      "py-3 px-[var(--space-md)] font-semibold uppercase tracking-wider text-[var(--brand-ink-muted)] whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                    style={{ fontSize: "var(--text-eyebrow)", lineHeight: "var(--leading-eyebrow)" }}
                    aria-sort={
                      sortable
                        ? isActive
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={cn(
                          "inline-flex items-center gap-1.5 transition-colors",
                          col.align === "right" && "ml-auto",
                          col.align === "center" && "mx-auto",
                          isActive
                            ? "text-[var(--brand-ink)]"
                            : "hover:text-[var(--brand-ink)]"
                        )}
                      >
                        <span>{col.header}</span>
                        {isActive ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={14} aria-hidden="true" />
                          ) : (
                            <ArrowDown size={14} aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="opacity-50" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedData.map(row => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-[var(--brand-canvas-soft)]/50 transition-colors"
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-[var(--space-sm)] px-[var(--space-md)] text-[var(--brand-ink)]",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                    style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
          <div className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
            Showing <span className="font-semibold text-[var(--brand-ink)]">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-[var(--brand-ink)]">
              {Math.min(startIndex + pageSize, sortedData.length)}
            </span>{" "}
            of <span className="font-semibold text-[var(--brand-ink)]">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              className={cn(
                "p-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--brand-ink-muted)] cursor-pointer",
                "hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)] transition-all active:scale-[0.98]",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className={cn(
                "p-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--brand-ink-muted)] cursor-pointer",
                "hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)] transition-all active:scale-[0.98]",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers(activePage, totalPages).map((p, i) => {
              if (p === "...") {
                return (
                  <span key={`dots-${i}`} className="px-2 text-[var(--brand-ink-muted)] select-none">
                    ...
                  </span>
                )
              }
              const isCurrent = p === activePage
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => setCurrentPage(Number(p))}
                  className={cn(
                    "min-w-[32px] h-8 px-2 rounded-[var(--radius-md)] border text-sm font-medium transition-all active:scale-[0.98] cursor-pointer",
                    isCurrent
                      ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white shadow-sm font-semibold"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]"
                  )}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
              className={cn(
                "p-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--brand-ink-muted)] cursor-pointer",
                "hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)] transition-all active:scale-[0.98]",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              className={cn(
                "p-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--brand-ink-muted)] cursor-pointer",
                "hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)] transition-all active:scale-[0.98]",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

