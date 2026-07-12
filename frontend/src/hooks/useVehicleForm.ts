import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createVehicle, getVehicle, updateVehicle } from "@/api/vehicles"
import type { VehicleCreate, VehicleType, VehicleStatus } from "@/api/types"

export function useVehicleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    registration_number: "",
    name: "",
    type: "",
    max_capacity_kg: "",
    odometer_km: "",
    acquisition_cost: "",
    region: "",
    status: "Available",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicle(Number(id)),
    enabled: isEdit,
  })

  useEffect(() => {
    if (vehicle) {
      setForm({
        registration_number: vehicle.registration_number,
        name: vehicle.name,
        type: vehicle.type,
        max_capacity_kg: String(vehicle.max_capacity_kg),
        odometer_km: String(vehicle.odometer_km),
        acquisition_cost: String(vehicle.acquisition_cost),
        region: vehicle.region,
        status: vehicle.status ?? "Available",
      })
    }
  }, [vehicle])

  const createMutation = useMutation({
    mutationFn: (data: VehicleCreate) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle created")
      navigate("/vehicles")
    },
    onError: () => toast.error("Failed to save vehicle"),
  })

  const updateMutation = useMutation({
    mutationFn: (data: VehicleCreate) => updateVehicle(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle updated")
      navigate("/vehicles")
    },
    onError: () => toast.error("Failed to save vehicle"),
  })

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.registration_number.trim()) newErrors.registration_number = "Registration number is required"
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.type.trim()) newErrors.type = "Type is required"
    if (!form.max_capacity_kg || Number(form.max_capacity_kg) <= 0) newErrors.max_capacity_kg = "Enter valid capacity"
    if (!form.acquisition_cost || Number(form.acquisition_cost) <= 0) newErrors.acquisition_cost = "Enter valid cost"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload: VehicleCreate = {
      registration_number: form.registration_number,
      name: form.name,
      type: form.type as VehicleType,
      max_capacity_kg: Number(form.max_capacity_kg),
      odometer_km: Number(form.odometer_km) || 0,
      acquisition_cost: Number(form.acquisition_cost),
      region: form.region,
      status: form.status as VehicleStatus,
    }

    if (isEdit) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return {
    id,
    isEdit,
    form,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    navigate,
    isLoading,
  }
}
