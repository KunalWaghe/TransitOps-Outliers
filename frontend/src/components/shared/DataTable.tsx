import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  width?: string
  align?: "left" | "right" | "center"
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyMessage?: string
  className?: string
  isLoading?: boolean
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "No records found", className, isLoading }: DataTableProps<T>) {
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

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  "py-3 px-[var(--space-md)] font-semibold uppercase tracking-wider text-[var(--brand-ink-muted)] whitespace-nowrap",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
                style={{ fontSize: "var(--text-eyebrow)", lineHeight: "var(--leading-eyebrow)" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {data.map(row => (
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
  )
}
