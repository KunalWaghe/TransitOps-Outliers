import { useMemo, useState } from "react"
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

interface Trip {
  id: number
  trip_id: string
  source: string
  destination: string
  vehicle: string
  driver: string
  cargo_weight_kg: number
  planned_distance_km: number
  status: string
}

const mockTrips: Trip[] = [
  { id: 1, trip_id: "TR-8429", source: "Seattle North Terminal", destination: "Portland South Depot", vehicle: "Bus-042", driver: "John Doe", cargo_weight_kg: 32000, planned_distance_km: 280, status: "Dispatched" },
  { id: 2, trip_id: "TR-8430", source: "Downtown Hub", destination: "Northside Loop", vehicle: "Van-11A", driver: "Alice Smith", cargo_weight_kg: 800, planned_distance_km: 45, status: "Completed" },
  { id: 3, trip_id: "TR-8431", source: "Airport Terminal", destination: "City Center", vehicle: "Bus-019", driver: "Mike Ross", cargo_weight_kg: 1200, planned_distance_km: 35, status: "Draft" },
  { id: 4, trip_id: "TR-8425", source: "South Park Depot", destination: "Eastside Warehouse", vehicle: "Van-08B", driver: "Sarah Jones", cargo_weight_kg: 600, planned_distance_km: 20, status: "Cancelled" },
]

const statusVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
  Draft: "draft",
  Dispatched: "dispatched",
  Completed: "completed",
  Cancelled: "cancelled",
}

export function TripsListPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTrips = useMemo(() => {
    let data = [...mockTrips]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(t =>
        t.trip_id.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.vehicle.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      data = data.filter(t => t.status === statusFilter)
    }

    return data
  }, [search, statusFilter])

  const columns: Column<Trip>[] = [
    {
      key: "trip_id",
      header: "Trip ID",
      render: t => <Link to={`/trips/${t.id}`} className="font-mono text-[var(--brand-primary)] hover:underline">{t.trip_id}</Link>,
    },
    { key: "vehicle", header: "Vehicle", render: t => <span className="font-medium">{t.vehicle}</span> },
    { key: "driver", header: "Driver", render: t => t.driver },
    {
      key: "route",
      header: "Route",
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
      render: t => <span>{t.cargo_weight_kg.toLocaleString("en-IN")} kg</span>,
    },
    {
      key: "status",
      header: "Status",
      render: t => <StatusBadge status={t.status} variant={statusVariantMap[t.status] ?? "neutral"} />,
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
          <DataTable columns={columns} data={filteredTrips} keyExtractor={t => t.id} />
        ) : (
          <EmptyState title="No trips found" message="Try adjusting your search or filters." />
        )}
      </Card>
    </div>
  )
}
