import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"
import { useTripsList, type Trip } from "@/hooks/useTripsList"

const statusVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
  Draft: "draft",
  Dispatched: "dispatched",
  Completed: "completed",
  Cancelled: "cancelled",
}

export function TripsListPage() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrips,
  } = useTripsList()

  const columns: Column<Trip>[] = [
    {
      key: "trip_id",
      header: "Trip ID",
      sortValue: t => t.id,
      render: t => <Link to={`/trips/${t.id}`} className="font-mono text-[var(--brand-primary)] hover:underline">{t.trip_id}</Link>,
    },
    { key: "vehicle", header: "Vehicle", render: t => <span className="font-medium">{t.vehicle}</span> },
    { key: "driver", header: "Driver", render: t => t.driver },
    {
      key: "route",
      header: "Route",
      sortValue: t => `${t.source} ${t.destination}`,
      render: t => (
        <span className="text-[var(--brand-ink-muted)]">
          {t.source} <span className="mx-1">→</span> {t.destination}
        </span>
      ),
    },
    {
      key: "cargo_weight_kg",
      header: "Cargo",
      align: "right",
      sortValue: t => t.cargo_weight_kg,
      render: t => <span>{t.cargo_weight_kg.toLocaleString("en-IN")} kg</span>,
    },
    {
      key: "status",
      header: "Status",
      render: t => <StatusBadge status={t.status || "Unknown"} variant={statusVariantMap[t.status || ""] ?? "neutral"} />,
    },
  ]

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Trips" subtitle="Plan, dispatch, and track trips.">
        <Button leftIcon={<Plus size={18} />} asChild>
          <Link to="/trips/new">Create Trip</Link>
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
              placeholder="Search trips..."
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
              { value: "Draft", label: "Draft" },
              { value: "Dispatched", label: "Dispatched" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            className="w-40"
          />
        </div>

        {filteredTrips.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredTrips}
            keyExtractor={t => t.id}
            defaultSort={{ key: "trip_id", direction: "desc" }}
          />
        ) : (
          <EmptyState title="No trips found" message="Try adjusting your search or filters." />
        )}
      </Card>
    </div>
  )
}
