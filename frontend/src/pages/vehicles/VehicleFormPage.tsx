import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { cn } from "@/lib/utils"
import { useVehicleForm } from "@/hooks/useVehicleForm"

export function VehicleFormPage() {
  const navigate = useNavigate()
  const {
    isEdit,
    form,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
  } = useVehicleForm()

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
