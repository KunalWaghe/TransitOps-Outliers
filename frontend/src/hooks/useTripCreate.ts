import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { createTrip } from "@/api/trips"
import { getVehicles } from "@/api/vehicles"
import { getDrivers } from "@/api/drivers"
import type { TripCreate, TripStatus } from "@/api/types"

export const cargoTypes = [
  { value: "dry_van", label: "Dry Van (Standard)" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "hazardous", label: "Hazardous" },
]

export const priorities = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "critical", label: "Critical" },
]

export function useTripCreate() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    source: "",
    destination: "",
    driver_id: "",
    vehicle_id: "",
    cargo_weight_kg: "32500",
    cargo_type: "dry_van",
    priority: "standard",
    planned_distance_km: "450",
    revenue: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"dispatch" | "draft">("dispatch")

  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: () => getVehicles() })
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: () => getDrivers() })

  const availableVehicles = vehicles.filter(v => v.status === "Available")
  const availableDrivers = drivers.filter(d => d.status === "Available")

  const vehicleOptions = availableVehicles.map(v => ({ value: String(v.id), label: `${v.registration_number} (${v.name}, Cap ${v.max_capacity_kg}kg)` }))
  const driverOptions = availableDrivers.map(d => ({ value: String(d.id), label: `${d.name} (${d.license_category})` }))

  const createMutation = useMutation({
    mutationFn: (data: TripCreate) => createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] })
      toast.success(activeTab === "dispatch" ? "Trip dispatched successfully" : "Draft saved")
      navigate("/trips")
    },
    onError: () => toast.error("Failed to create trip"),
  })

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.source.trim()) newErrors.source = "Source is required"
    if (!form.destination.trim()) newErrors.destination = "Destination is required"
    if (!form.driver_id) newErrors.driver_id = "Select a driver"
    if (!form.vehicle_id) newErrors.vehicle_id = "Select a vehicle"
    if (!form.cargo_weight_kg || Number(form.cargo_weight_kg) <= 0) newErrors.cargo_weight_kg = "Enter valid weight"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload: TripCreate = {
      source: form.source,
      destination: form.destination,
      vehicle_id: Number(form.vehicle_id),
      driver_id: Number(form.driver_id),
      cargo_weight_kg: Number(form.cargo_weight_kg),
      planned_distance_km: Number(form.planned_distance_km) || 0,
      revenue: Number(form.revenue) || 0,
      status: (activeTab === "dispatch" ? "Dispatched" : "Draft") as TripStatus,
    }

    createMutation.mutate(payload)
  }

  const selectedVehicle = vehicleOptions.find(v => v.value === form.vehicle_id)
  const selectedDriver = driverOptions.find(d => d.value === form.driver_id)

  return {
    form,
    errors,
    isSubmitting: createMutation.isPending,
    activeTab,
    setActiveTab,
    updateField,
    handleSubmit,
    selectedVehicle,
    selectedDriver,
    vehicleOptions,
    driverOptions,
    navigate,
  }
}
