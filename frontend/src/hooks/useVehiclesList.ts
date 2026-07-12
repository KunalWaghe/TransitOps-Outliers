import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getVehicles } from "@/api/vehicles"
import type { VehicleResponse } from "@/api/types"

export type Vehicle = VehicleResponse

export function useVehiclesList() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

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

    return data
  }, [vehicles, search, typeFilter, statusFilter])

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filteredVehicles,
    isLoading,
  }
}
