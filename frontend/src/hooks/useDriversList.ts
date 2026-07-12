import { useMemo, useState } from "react"

export interface Driver {
  id: number
  name: string
  license_number: string
  license_category: string
  license_expiry: string
  contact_number: string
  safety_score: number
  status: string
}

export const mockDrivers: Driver[] = [
  { id: 1, name: "John Doe", license_number: "DL-12345678", license_category: "HGV", license_expiry: "2026-08-15", contact_number: "+91 98765 43210", safety_score: 92, status: "Available" },
  { id: 2, name: "Alice Smith", license_number: "DL-87654321", license_category: "LMV", license_expiry: "2026-12-20", contact_number: "+91 91234 56789", safety_score: 88, status: "On Trip" },
  { id: 3, name: "Mike Ross", license_number: "DL-11223344", license_category: "HGV", license_expiry: "2026-07-25", contact_number: "+91 99887 76655", safety_score: 75, status: "Available" },
  { id: 4, name: "Sarah Jones", license_number: "DL-44332211", license_category: "LMV", license_expiry: "2025-11-10", contact_number: "+91 98765 11223", safety_score: 95, status: "Off Duty" },
]

export function isExpiringSoon(date: string): boolean {
  const expiry = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 30
}

export function isExpired(date: string): boolean {
  return new Date(date) < new Date()
}

export function useDriversList() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDrivers = useMemo(() => {
    let data = [...mockDrivers]

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
  }, [search, statusFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDrivers,
  }
}
