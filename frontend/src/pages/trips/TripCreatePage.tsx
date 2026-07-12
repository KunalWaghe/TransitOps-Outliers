import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, MapPin, Flag, Package, Save, Send } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { cn } from "@/lib/utils"
import {
  useTripCreate,
  cargoTypes,
  priorities,
} from "@/hooks/useTripCreate"

export function TripCreatePage() {
  const navigate = useNavigate()
  const {
    form,
    errors,
    isSubmitting,
    activeTab,
    setActiveTab,
    updateField,
    handleSubmit,
    selectedDriver,
    selectedVehicle,
    vehicleOptions,
    driverOptions,
  } = useTripCreate()

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Create New Trip" subtitle="Plan a trip and assign resources." />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-lg)]">
        {/* Left column: form */}
        <div className="lg:col-span-8 space-y-[var(--space-md)]">
          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4 flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
              <MapPin size={18} className="text-[var(--brand-ink-muted)]" />
              Route Planning
            </h3>
            <div className="space-y-4">
              <Input
                label="Source Hub"
                leftIcon={<MapPin size={18} />}
                value={form.source}
                onChange={e => updateField("source", e.target.value)}
                error={errors.source}
                placeholder="Seattle North Terminal"
              />
              <div className="flex items-center gap-3 pl-4 text-[var(--brand-ink-muted)]">
                <div className="w-px h-6 bg-[var(--border)]" />
                <span style={{ fontSize: "var(--text-caption)" }}>Est. Distance: {form.planned_distance_km || 0} km</span>
              </div>
              <Input
                label="Destination Hub"
                leftIcon={<Flag size={18} />}
                value={form.destination}
                onChange={e => updateField("destination", e.target.value)}
                error={errors.destination}
                placeholder="Portland South Depot"
              />
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4 flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
              <Package size={18} className="text-[var(--brand-ink-muted)]" />
              Resource Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
              <Select
                label="Driver Selection"
                value={form.driver_id}
                onChange={e => updateField("driver_id", e.target.value)}
                options={[{ value: "", label: "Select driver" }, ...driverOptions]}
                error={errors.driver_id}
              />
              <Select
                label="Vehicle Selection"
                value={form.vehicle_id}
                onChange={e => updateField("vehicle_id", e.target.value)}
                options={[{ value: "", label: "Select vehicle" }, ...vehicleOptions]}
                error={errors.vehicle_id}
              />
            </div>
            {selectedDriver && (
              <p className="mt-2 text-[#4ade80] flex items-center gap-1" style={{ fontSize: "var(--text-caption)" }}>
                <CheckCircle2 size={14} /> Hours of Service verified
              </p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4 flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
              <Package size={18} className="text-[var(--brand-ink-muted)]" />
              Cargo Specifications
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                    Total Weight
                  </label>
                  <span className="font-medium" style={{ fontSize: "var(--text-caption)" }}>
                    {Number(form.cargo_weight_kg).toLocaleString("en-IN")}{" "}
                    <span className="text-[var(--brand-ink-muted)]">/ 45,000 kg</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45000}
                  value={form.cargo_weight_kg}
                  onChange={e => updateField("cargo_weight_kg", e.target.value)}
                  className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--brand-primary)]"
                />
                <div className="flex justify-between mt-1 text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                  <span>0</span>
                  <span>Max Capacity</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
                <Select
                  label="Cargo Type"
                  value={form.cargo_type}
                  onChange={e => updateField("cargo_type", e.target.value)}
                  options={cargoTypes}
                />
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={e => updateField("priority", e.target.value)}
                  options={priorities}
                />
              </div>
              <Input
                label="Planned Distance (km)"
                type="number"
                value={form.planned_distance_km}
                onChange={e => updateField("planned_distance_km", e.target.value)}
              />
              <Input
                label="Revenue (₹)"
                type="number"
                value={form.revenue}
                onChange={e => updateField("revenue", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </Card>
        </div>

        {/* Right column: summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-20">
            <h3 className="font-semibold text-[var(--brand-ink)] mb-5" style={{ fontSize: "var(--text-title)" }}>
              Trip Readiness
            </h3>
            <div className="space-y-4 mb-6 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-[var(--border)] z-0" />
              <ReadinessItem label="Route Feasibility" description="Distance and terrain confirmed." checked={Boolean(form.source && form.destination)} />
              <ReadinessItem label="Driver Compliance" description={selectedDriver ? selectedDriver.label.split(" (")[1].replace(")", "") : "Select a driver"} checked={Boolean(form.driver_id)} />
              <ReadinessItem label="Vehicle Match" description={selectedVehicle ? `Safe operating range (${Math.round((Number(form.cargo_weight_kg) / 45000) * 100)}%).` : "Select a vehicle"} checked={Boolean(form.vehicle_id)} />
            </div>

            <div className="flex flex-col gap-2.5 mt-6 pt-5 border-t border-[var(--border)]">
              <div className="flex p-1 bg-[var(--background)] rounded-[var(--radius-md)] border border-[var(--border)] mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("dispatch")}
                  className={cn(
                    "flex-1 py-1.5 text-center font-medium rounded-[var(--radius-sm)] transition-all",
                    activeTab === "dispatch" ? "bg-[var(--card)] text-[var(--brand-ink)] shadow-sm" : "text-[var(--brand-ink-muted)]"
                  )}
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("draft")}
                  className={cn(
                    "flex-1 py-1.5 text-center font-medium rounded-[var(--radius-sm)] transition-all",
                    activeTab === "draft" ? "bg-[var(--card)] text-[var(--brand-ink)] shadow-sm" : "text-[var(--brand-ink-muted)]"
                  )}
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  Save Draft
                </button>
              </div>
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={activeTab === "dispatch" ? <Send size={18} /> : <Save size={18} />}
                className="w-full"
              >
                {activeTab === "dispatch" ? "Dispatch Trip" : "Save Draft"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                leftIcon={<ArrowLeft size={18} />}
                onClick={() => navigate("/trips")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}

function ReadinessItem({ label, description, checked }: { label: string; description: string; checked: boolean }) {
  return (
    <div className="flex items-start gap-3 relative z-10">
      <div className="mt-0.5 bg-[var(--card)] rounded-full p-0.5">
        <CheckCircle2 size={18} className={checked ? "text-[#4ade80]" : "text-[var(--brand-ink-faint)]"} />
      </div>
      <div>
        <p className="font-medium text-[var(--brand-ink)]" style={{ fontSize: "var(--text-body-sm)" }}>
          {label}
        </p>
        <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
          {description}
        </p>
      </div>
    </div>
  )
}
