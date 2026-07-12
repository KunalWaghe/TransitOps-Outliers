import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export const mockDrivers = [
  { value: "1", label: "Sarah Jenkins (LMV, 8h 15m remaining)" },
  { value: "2", label: "Michael Chen (HGV, 6h 30m remaining)" },
  { value: "3", label: "David Miller (LMV, 9h 00m remaining)" },
]

export const mockVehicles = [
  { value: "1", label: "TX-882 (Volvo VNL, Cap 45k lbs)" },
  { value: "2", label: "TX-901 (Freightliner, Cap 40k lbs)" },
  { value: "3", label: "TX-945 (Peterbilt, Cap 50k lbs)" },
]

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"dispatch" | "draft">("dispatch")

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

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 700))
      toast.success(activeTab === "dispatch" ? "Trip dispatched successfully" : "Draft saved")
      navigate("/trips")
    } catch {
      toast.error("Failed to create trip")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedVehicle = mockVehicles.find(v => v.value === form.vehicle_id)
  const selectedDriver = mockDrivers.find(d => d.value === form.driver_id)

  return {
    form,
    errors,
    isSubmitting,
    activeTab,
    setActiveTab,
    updateField,
    handleSubmit,
    selectedVehicle,
    selectedDriver,
    navigate,
  }
}
