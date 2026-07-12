import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createDriver, getDriver, updateDriver } from "@/api/drivers"
import type { DriverCreate, LicenseCategory, DriverStatus } from "@/api/types"

export function useDriverForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: "",
    license_number: "",
    license_category: "",
    license_expiry: "",
    contact_number: "",
    safety_score: "100",
    status: "Available",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: driver, isLoading } = useQuery({
    queryKey: ["drivers", id],
    queryFn: () => getDriver(Number(id)),
    enabled: isEdit,
  })

  useEffect(() => {
    if (driver) {
      setForm({
        name: driver.name,
        license_number: driver.license_number,
        license_category: driver.license_category,
        license_expiry: driver.license_expiry,
        contact_number: driver.contact_number,
        safety_score: String(driver.safety_score),
        status: driver.status ?? "Available",
      })
    }
  }, [driver])

  const createMutation = useMutation({
    mutationFn: (data: DriverCreate) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      toast.success("Driver created")
      navigate("/drivers")
    },
    onError: () => toast.error("Failed to save driver"),
  })

  const updateMutation = useMutation({
    mutationFn: (data: DriverCreate) => updateDriver(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      toast.success("Driver updated")
      navigate("/drivers")
    },
    onError: () => toast.error("Failed to save driver"),
  })

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.license_number.trim()) newErrors.license_number = "License number is required"
    if (!form.license_category.trim()) newErrors.license_category = "License category is required"
    if (!form.license_expiry) newErrors.license_expiry = "Expiry date is required"
    if (!form.contact_number.trim()) newErrors.contact_number = "Contact number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload: DriverCreate = {
      name: form.name,
      license_number: form.license_number,
      license_category: form.license_category as LicenseCategory,
      license_expiry: form.license_expiry,
      contact_number: form.contact_number,
      safety_score: Number(form.safety_score),
      status: form.status as DriverStatus,
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
