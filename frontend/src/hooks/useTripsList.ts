import { useMemo, useState } from "react"

export interface Trip {
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

export const mockTrips: Trip[] = [
  { id: 1, trip_id: "TR-8429", source: "Seattle North Terminal", destination: "Portland South Depot", vehicle: "Bus-042", driver: "John Doe", cargo_weight_kg: 32000, planned_distance_km: 280, status: "Dispatched" },
  { id: 2, trip_id: "TR-8430", source: "Downtown Hub", destination: "Northside Loop", vehicle: "Van-11A", driver: "Alice Smith", cargo_weight_kg: 800, planned_distance_km: 45, status: "Completed" },
  { id: 3, trip_id: "TR-8431", source: "Airport Terminal", destination: "City Center", vehicle: "Bus-019", driver: "Mike Ross", cargo_weight_kg: 1200, planned_distance_km: 35, status: "Draft" },
  { id: 4, trip_id: "TR-8425", source: "South Park Depot", destination: "Eastside Warehouse", vehicle: "Van-08B", driver: "Sarah Jones", cargo_weight_kg: 600, planned_distance_km: 20, status: "Cancelled" },
]

export function useTripsList() {
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

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrips,
  }
}
