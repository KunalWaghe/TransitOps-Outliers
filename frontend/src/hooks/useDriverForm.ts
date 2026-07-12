import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

export function useDriverForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(isEdit ? "Driver updated" : "Driver created")
      navigate("/drivers")
    } catch {
      toast.error("Failed to save driver")
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
