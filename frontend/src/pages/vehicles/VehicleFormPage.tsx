import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { cn } from "@/lib/utils"

export function VehicleFormPage() {
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

  return (
    <div className="space-y-[var(--space-lg)] max-w-3xl">
      <PageHeader
        title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
        subtitle={isEdit ? "Update vehicle registration details." : "Register a new fleet vehicle."}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-[var(--space-md)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
            <Input
              label="Registration Number"
              value={form.registration_number}
              onChange={e => updateField("registration_number", e.target.value)}
              error={errors.registration_number}
              placeholder="VAN-05"
            />
            <Input
              label="Name"
              value={form.name}
              onChange={e => updateField("name", e.target.value)}
              error={errors.name}
              placeholder="Ford Transit"
            />
            <Select
              label="Type"
              value={form.type}
              onChange={e => updateField("type", e.target.value)}
              options={[
                { value: "", label: "Select type" },
                { value: "Van", label: "Van" },
                { value: "Truck", label: "Truck" },
                { value: "Mini Truck", label: "Mini Truck" },
                { value: "Bus", label: "Bus" },
              ]}
              error={errors.type}
            />
            <Input
              label="Region"
              value={form.region}
              onChange={e => updateField("region", e.target.value)}
              placeholder="North"
            />
            <Input
              label="Max Capacity (kg)"
              type="number"
              value={form.max_capacity_kg}
              onChange={e => updateField("max_capacity_kg", e.target.value)}
              error={errors.max_capacity_kg}
              placeholder="1200"
            />
            <Input
              label="Odometer (km)"
              type="number"
              value={form.odometer_km}
              onChange={e => updateField("odometer_km", e.target.value)}
              placeholder="0"
            />
            <Input
              label="Acquisition Cost (₹)"
              type="number"
              value={form.acquisition_cost}
              onChange={e => updateField("acquisition_cost", e.target.value)}
              error={errors.acquisition_cost}
              placeholder="850000"
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => updateField("status", e.target.value)}
              options={[
                { value: "Available", label: "Available" },
                { value: "On Trip", label: "On Trip" },
                { value: "In Maintenance", label: "In Maintenance" },
              ]}
            />
          </div>

          {errors.duplicate && (
            <p className="text-[var(--destructive)]" style={{ fontSize: "var(--text-caption)" }}>
              {errors.duplicate}
            </p>
          )}

          <div className="flex items-center gap-[var(--space-sm)] pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="ghost"
              leftIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/vehicles")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Save size={18} />}
              className={cn("ml-auto")}
            >
              {isEdit ? "Update Vehicle" : "Save Vehicle"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
