import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

export function useVehicleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(isEdit ? "Vehicle updated" : "Vehicle created")
      navigate("/vehicles")
    } catch {
      toast.error("Failed to save vehicle")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    id,
    isEdit,
    form,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    navigate,
  }
}
