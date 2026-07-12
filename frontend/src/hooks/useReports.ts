import { useState } from "react"
import toast from "react-hot-toast"

export const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 14000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 20000 },
  { month: "Jun", revenue: 28000 },
  { month: "Jul", revenue: 26000 },
  { month: "Aug", revenue: 32000 },
]

export const topCostlyVehicles = [
  { name: "TRUCK-II", cost: 12450, color: "#dd5b00" },
  { name: "MINI-03", cost: 8200, color: "#2a9d99" },
  { name: "VAN-05", cost: 5100, color: "var(--brand-primary)" },
]

export const maxCost = topCostlyVehicles[0].cost

export function useReports() {
  const [year, setYear] = useState("2026")
  const financialAnalyst = true

  const handleExport = () => {
    toast.success("Report export started")
  }

  return {
    year,
    setYear,
    financialAnalyst,
    handleExport,
  }
}
