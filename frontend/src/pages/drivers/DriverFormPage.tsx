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

export function DriverFormPage() {
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

  return (
    <div className="space-y-[var(--space-lg)] max-w-3xl">
      <PageHeader
        title={isEdit ? "Edit Driver" : "Add Driver"}
        subtitle={isEdit ? "Update driver details and license." : "Register a new driver."}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-[var(--space-md)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
            <Input
              label="Full Name"
              value={form.name}
              onChange={e => updateField("name", e.target.value)}
              error={errors.name}
              placeholder="John Doe"
            />
            <Input
              label="License Number"
              value={form.license_number}
              onChange={e => updateField("license_number", e.target.value)}
              error={errors.license_number}
              placeholder="DL-12345678"
            />
            <Select
              label="License Category"
              value={form.license_category}
              onChange={e => updateField("license_category", e.target.value)}
              options={[
                { value: "", label: "Select category" },
                { value: "LMV", label: "LMV" },
                { value: "HGV", label: "HGV" },
                { value: "MC", label: "Motorcycle" },
              ]}
              error={errors.license_category}
            />
            <Input
              label="License Expiry"
              type="date"
              value={form.license_expiry}
              onChange={e => updateField("license_expiry", e.target.value)}
              error={errors.license_expiry}
            />
            <Input
              label="Contact Number"
              value={form.contact_number}
              onChange={e => updateField("contact_number", e.target.value)}
              error={errors.contact_number}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Safety Score"
              type="number"
              min={0}
              max={100}
              value={form.safety_score}
              onChange={e => updateField("safety_score", e.target.value)}
              placeholder="100"
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => updateField("status", e.target.value)}
              options={[
                { value: "Available", label: "Available" },
                { value: "On Trip", label: "On Trip" },
                { value: "Off Duty", label: "Off Duty" },
              ]}
            />
          </div>

          <div className="flex items-center gap-[var(--space-sm)] pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="ghost"
              leftIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/drivers")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Save size={18} />}
              className={cn("ml-auto")}
            >
              {isEdit ? "Update Driver" : "Save Driver"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
