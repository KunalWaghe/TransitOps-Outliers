import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: number
  registration_number: string
  name: string
  type: string
  max_capacity_kg: number
  odometer_km: number
  acquisition_cost: number
  region: string
  status: string
}

const mockVehicles: Vehicle[] = [
  { id: 1, registration_number: "VAN-05", name: "Ford Transit", type: "Van", max_capacity_kg: 1200, odometer_km: 45200, acquisition_cost: 850000, region: "North", status: "Available" },
  { id: 2, registration_number: "TRUCK-11", name: "Volvo FH", type: "Truck", max_capacity_kg: 18000, odometer_km: 128500, acquisition_cost: 4500000, region: "East", status: "In Maintenance" },
  { id: 3, registration_number: "MINI-03", name: "Tata Ace", type: "Mini Truck", max_capacity_kg: 700, odometer_km: 32100, acquisition_cost: 420000, region: "South", status: "Available" },
  { id: 4, registration_number: "BUS-019", name: "Ashok Leyland", type: "Bus", max_capacity_kg: 5000, odometer_km: 98000, acquisition_cost: 2200000, region: "West", status: "On Trip" },
  { id: 5, registration_number: "VAN-08", name: "Maruti Eeco", type: "Van", max_capacity_kg: 800, odometer_km: 28000, acquisition_cost: 520000, region: "North", status: "Available" },
]

const statusVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
  Available: "available",
  "On Trip": "in_use",
  "In Maintenance": "in_maintenance",
}

export function VehiclesListPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<keyof Vehicle | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const filteredVehicles = useMemo(() => {
    let data = [...mockVehicles]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(v =>
        v.registration_number.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q)
      )
    }

    if (typeFilter !== "all") {
      data = data.filter(v => v.type === typeFilter)
    }

    if (statusFilter !== "all") {
      data = data.filter(v => v.status === statusFilter)
    }

    if (sortKey) {
      data.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
      })
    }

    return data
  }, [search, typeFilter, statusFilter, sortKey, sortDir])

  const columns: Column<Vehicle>[] = [
    {
      key: "registration_number",
      header: "Reg. Number",
      render: v => <span className="font-mono text-[var(--brand-ink-muted)]">{v.registration_number}</span>,
    },
    { key: "name", header: "Name", render: v => <span className="font-medium">{v.name}</span> },
    { key: "type", header: "Type", render: v => <span className="text-[var(--brand-ink-muted)]">{v.type}</span> },
    { key: "region", header: "Region", render: v => v.region },
    {
      key: "max_capacity_kg",
      header: "Capacity",
      align: "right",
      render: v => <span>{v.max_capacity_kg.toLocaleString("en-IN")} kg</span>,
    },
    {
      key: "status",
      header: "Status",
      render: v => <StatusBadge status={v.status} variant={statusVariantMap[v.status] ?? "neutral"} />,
    },
    {
      key: "actions",
      header: "",
      render: v => (
        <Link
          to={`/vehicles/${v.id}/edit`}
          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-active)] font-medium"
          style={{ fontSize: "var(--text-caption)" }}
        >
          Edit
        </Link>
      ),
    },
  ]

  const handleSort = (key: keyof Vehicle) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Vehicles" subtitle="Manage fleet vehicles and registration details.">
        <Button leftIcon={<Plus size={18} />} asChild>
          <Link to="/vehicles/new">Add Vehicle</Link>
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
              placeholder="Search vehicles..."
              className={cn(
                "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)] pl-10 pr-3 py-2",
                "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]"
              )}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
          </div>
          <div className="flex gap-[var(--space-xs)]">
            <Select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              options={[
                { value: "all", label: "All Types" },
                { value: "Van", label: "Van" },
                { value: "Truck", label: "Truck" },
                { value: "Mini Truck", label: "Mini Truck" },
                { value: "Bus", label: "Bus" },
              ]}
              className="w-40"
            />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Available", label: "Available" },
                { value: "On Trip", label: "On Trip" },
                { value: "In Maintenance", label: "In Maintenance" },
              ]}
              className="w-40"
            />
            <Button variant="secondary" leftIcon={<SlidersHorizontal size={16} />}>
              Filter
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSort("registration_number")}
          className="hidden"
        >
          <ArrowUpDown size={16} />
        </button>

        {filteredVehicles.length > 0 ? (
          <DataTable columns={columns} data={filteredVehicles} keyExtractor={v => v.id} />
        ) : (
          <EmptyState title="No vehicles found" message="Try adjusting your search or filters." />
        )}
      </Card>
    </div>
  )
}
