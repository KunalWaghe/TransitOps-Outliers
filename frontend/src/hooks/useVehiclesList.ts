import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getVehicles } from "@/api/vehicles"
import type { VehicleResponse } from "@/api/types"

export type Vehicle = VehicleResponse

export function useVehiclesList() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<keyof Vehicle | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles()
  })

  const filteredVehicles = useMemo(() => {
    let data = [...vehicles]

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
  }, [vehicles, search, typeFilter, statusFilter, sortKey, sortDir])

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
    isLoading,
  }
}
