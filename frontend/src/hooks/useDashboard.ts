import { useEffect, useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getDashboardKpis } from "@/api/dashboard"
import { getTrips } from "@/api/trips"
import { getVehicles } from "@/api/vehicles"
import { getDrivers } from "@/api/drivers"

export const utilizationData = [
  { hour: "00:00", value: 40 },
  { hour: "03:00", value: 55 },
  { hour: "06:00", value: 60 },
  { hour: "09:00", value: 45 },
  { hour: "12:00", value: 70 },
  { hour: "15:00", value: 85 },
  { hour: "18:00", value: 75 },
  { hour: "21:00", value: 80 },
  { hour: "23:00", value: 65 },
  { hour: "Now", value: 71 },
]

export interface TripRow {
  id: string
  vehicle: string
  driver: string
  driverInitials: string
  route: string
  status: string
  statusVariant: "active" | "delayed" | "dispatched" | "completed" | "neutral" | "available" | "in_use" | "in_maintenance" | "draft" | "cancelled"
  eta: string
  etaHighlight?: string
}

export function useDashboard() {
  const [currentHour, setCurrentHour] = useState("24h")

  useEffect(() => {
    document.title = "TransitOps Dashboard"
  }, [])

  const { data: kpis } = useQuery({ queryKey: ["dashboard", "kpis"], queryFn: () => getDashboardKpis() })
  const { data: rawTrips = [], isLoading: tripsLoading } = useQuery({ queryKey: ["trips"], queryFn: () => getTrips() })
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({ queryKey: ["vehicles"], queryFn: () => getVehicles() })
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: () => getDrivers() })

  const trips = useMemo(() => {
    return rawTrips.slice(0, 5).map(t => {
      const v = vehicles.find(v => v.id === t.vehicle_id)
      const d = drivers.find(d => d.id === t.driver_id)
      const driverName = d?.name || `Driver ${t.driver_id}`
      const initials = driverName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      
      let statusVariant: TripRow["statusVariant"] = "neutral"
      if (t.status === "Dispatched") statusVariant = "active"
      if (t.status === "Completed") statusVariant = "completed"
      if (t.status === "Draft") statusVariant = "draft"
      if (t.status === "Cancelled") statusVariant = "cancelled"

      return {
        id: `TR-${t.id}`,
        vehicle: v?.registration_number || `Vehicle ${t.vehicle_id}`,
        driver: driverName,
        driverInitials: initials,
        route: `${t.source} -> ${t.destination}`,
        status: t.status || "Unknown",
        statusVariant,
        eta: "-"
      }
    })
  }, [rawTrips, vehicles, drivers])

  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => v.status === "Available").length
  const inMaintenanceVehicles = vehicles.filter(v => v.status === "In Shop").length
  const activeTripsCount = kpis?.active_trips || rawTrips.filter(t => t.status === "Dispatched").length
  
  const utilizedVehicles = totalVehicles - availableVehicles - inMaintenanceVehicles
  const fleetUtilization = totalVehicles > 0 ? Math.round((utilizedVehicles / totalVehicles) * 100) : 0

  return {
    currentHour,
    setCurrentHour,
    trips,
    kpiStats: {
      totalVehicles,
      availableVehicles,
      inMaintenanceVehicles,
      activeTripsCount,
      fleetUtilization
    },
    isLoading: tripsLoading || vehiclesLoading
  }
}
