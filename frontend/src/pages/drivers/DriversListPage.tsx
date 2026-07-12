import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"
import {
  useDriversList,
  isExpired,
  isExpiringSoon,
  type Driver,
} from "@/hooks/useDriversList"

const statusVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
  Available: "available",
  "On Trip": "in_use",
  "Off Duty": "neutral",
}

export function DriversListPage() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDrivers,
  } = useDriversList()

  const columns: Column<Driver>[] = [
    {
      key: "name",
      header: "Driver",
      render: d => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[var(--brand-canvas-soft)] border border-[var(--brand-hairline)] flex items-center justify-center text-[11px] font-semibold text-[var(--brand-ink-muted)]">
            {d.name.split(" ").map(n => n[0]).join("")}
          </div>
          <span className="font-medium">{d.name}</span>
        </div>
      ),
    },
    { key: "license_number", header: "License", render: d => <span className="font-mono text-[var(--brand-ink-muted)]">{d.license_number}</span> },
    { key: "license_category", header: "Category", render: d => d.license_category },
    {
      key: "license_expiry",
      header: "License Expiry",
      render: d => {
        const expired = isExpired(d.license_expiry)
        const expiring = isExpiringSoon(d.license_expiry)
        return (
          <div className="flex flex-col gap-1">
            <span className={cn(expired && "text-[var(--destructive)]", expiring && !expired && "text-[#dd5b00]")}>
              {formatDate(d.license_expiry)}
            </span>
            {expired && (
              <span className="text-[var(--destructive)]" style={{ fontSize: "var(--text-caption)" }}>Expired</span>
            )}
            {!expired && expiring && (
              <span className="text-[#dd5b00]" style={{ fontSize: "var(--text-caption)" }}>Expiring soon</span>
            )}
          </div>
        )
      },
    },
    { key: "safety_score", header: "Safety Score", align: "right", render: d => <span>{d.safety_score}</span> },
    {
      key: "status",
      header: "Status",
      render: d => <StatusBadge status={d.status} variant={statusVariantMap[d.status] ?? "neutral"} />,
    },
    {
      key: "actions",
      header: "",
      render: d => (
        <Link
          to={`/drivers/${d.id}/edit`}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-active)] font-medium"
          style={{ fontSize: "var(--text-caption)" }}
        >
          Edit
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Drivers" subtitle="Manage driver licenses and duty status.">
        <Button leftIcon={<Plus size={18} />} asChild>
          <Link to="/drivers/new">Add Driver</Link>
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col md:flex-row gap-[var(--space-sm)] mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-ink-muted)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search drivers..."
              className={cn(
                "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)] pl-10 pr-3 py-2",
                "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]"
              )}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "Available", label: "Available" },
              { value: "On Trip", label: "On Trip" },
              { value: "Off Duty", label: "Off Duty" },
            ]}
            className="w-40"
          />
        </div>

        {filteredDrivers.length > 0 ? (
          <DataTable columns={columns} data={filteredDrivers} keyExtractor={d => d.id} />
        ) : (
          <EmptyState title="No drivers found" message="Try adjusting your search or filters." />
        )}
      </Card>
    </div>
  )
}
