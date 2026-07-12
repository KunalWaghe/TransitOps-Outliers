import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTrips } from "@/api/trips"
import { getVehicles } from "@/api/vehicles"
import { getDrivers } from "@/api/drivers"
import type { TripResponse } from "@/api/types"

export interface Trip extends TripResponse {
  trip_id: string
  vehicle: string
  driver: string
}

export function useTripsList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: rawTrips = [], isLoading: isLoadingTrips } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips()
  })

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles()
  })

  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => getDrivers()
  })

  const trips: Trip[] = useMemo(() => {
    return rawTrips.map(t => ({
      ...t,
      trip_id: `TR-${t.id}`,
      vehicle: vehicles.find(v => v.id === t.vehicle_id)?.registration_number || `Vehicle ${t.vehicle_id}`,
      driver: drivers.find(d => d.id === t.driver_id)?.name || `Driver ${t.driver_id}`,
    }))
  }, [rawTrips, vehicles, drivers])

  const filteredTrips = useMemo(() => {
    let data = [...trips]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(t =>
        t.trip_id.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.vehicle.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      data = data.filter(t => t.status === statusFilter)
    }

    return data
  }, [trips, search, statusFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredTrips,
    isLoading: isLoadingTrips,
  }
}
