import { useMemo, useState } from "react"

export interface Vehicle {
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

export const mockVehicles: Vehicle[] = [
  { id: 1, registration_number: "VAN-05", name: "Ford Transit", type: "Van", max_capacity_kg: 1200, odometer_km: 45200, acquisition_cost: 850000, region: "North", status: "Available" },
  { id: 2, registration_number: "TRUCK-11", name: "Volvo FH", type: "Truck", max_capacity_kg: 18000, odometer_km: 128500, acquisition_cost: 4500000, region: "East", status: "In Maintenance" },
  { id: 3, registration_number: "MINI-03", name: "Tata Ace", type: "Mini Truck", max_capacity_kg: 700, odometer_km: 32100, acquisition_cost: 420000, region: "South", status: "Available" },
  { id: 4, registration_number: "BUS-019", name: "Ashok Leyland", type: "Bus", max_capacity_kg: 5000, odometer_km: 98000, acquisition_cost: 2200000, region: "West", status: "On Trip" },
  { id: 5, registration_number: "VAN-08", name: "Maruti Eeco", type: "Van", max_capacity_kg: 800, odometer_km: 28000, acquisition_cost: 520000, region: "North", status: "Available" },
]

export function useVehiclesList() {
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

  const handleSort = (key: keyof Vehicle) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDir,
    filteredVehicles,
    handleSort,
  }
}
