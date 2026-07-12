import { useEffect, useState } from "react"

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

export const trips: TripRow[] = [
  { id: "TR-8429", vehicle: "Bus-042", driver: "John Doe", driverInitials: "JD", route: "Downtown Express", status: "En Route", statusVariant: "active", eta: "14:30" },
  { id: "TR-8430", vehicle: "Van-11A", driver: "Alice Smith", driverInitials: "AS", route: "Northside Loop", status: "Delayed", statusVariant: "delayed", eta: "15:15", etaHighlight: "+15m" },
  { id: "TR-8431", vehicle: "Bus-019", driver: "Mike Ross", driverInitials: "MR", route: "Airport Shuttle", status: "Boarding", statusVariant: "dispatched", eta: "14:45" },
  { id: "TR-8425", vehicle: "Van-08B", driver: "Sarah Jones", driverInitials: "SJ", route: "South Park Run", status: "Completed", statusVariant: "completed", eta: "13:50" },
]

export interface Alert {
  id: string
  type: "error" | "warning" | "info"
  message: string
  meta: string
}

export const alerts: Alert[] = [
  { id: "1", type: "error", message: "Vehicle V-104 reported engine temperature anomaly.", meta: "Route 42 • 10 mins ago" },
  { id: "2", type: "warning", message: "Driver delay reported at Checkpoint Delta.", meta: "Trip TR-892 • 25 mins ago" },
  { id: "3", type: "info", message: "Routine maintenance schedule generated for Fleet B.", meta: "System • 1 hour ago" },
]

export function useDashboard() {
  const [currentHour, setCurrentHour] = useState("12h")

  useEffect(() => {
    document.title = "TransitOps Dashboard"
  }, [])

  return {
    currentHour,
    setCurrentHour,
  }
}
