import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getDrivers } from "@/api/drivers"
import type { DriverResponse } from "@/api/types"

export type Driver = DriverResponse

export function isExpiringSoon(date: string): boolean {
  if (!date) return false
  const expiry = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 30
}

export function isExpired(date: string): boolean {
  if (!date) return false
  return new Date(date) < new Date()
}

export function useDriversList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => getDrivers()
  })

  const filteredDrivers = useMemo(() => {
    let data = [...drivers]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.license_number.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      data = data.filter(d => d.status === statusFilter)
    }

    return data
  }, [drivers, search, statusFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDrivers,
    isLoading,
  }
}
