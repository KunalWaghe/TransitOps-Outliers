import { useMemo, useState } from "react"
import { Download, Filter, Info, Wrench } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

interface MaintenanceRecord {
  id: number
  date: string
  vehicle: string
  service_type: string
  cost: number
  status: "Active" | "Completed"
  notes?: string
}

const mockRecords: MaintenanceRecord[] = [
  { id: 1, date: "2026-07-12", vehicle: "VAN-05", service_type: "Oil Change", cost: 2500, status: "Active" },
  { id: 2, date: "2026-07-11", vehicle: "TRUCK-11", service_type: "Engine Repair", cost: 18000, status: "Completed" },
  { id: 3, date: "2026-07-10", vehicle: "MINI-03", service_type: "Tyre Replace", cost: 6200, status: "Active" },
  { id: 4, date: "2026-07-08", vehicle: "VAN-02", service_type: "Routine Inspection", cost: 850, status: "Completed" },
]

const vehicles = [
  { value: "", label: "Select vehicle" },
  { value: "VAN-05", label: "VAN-05" },
  { value: "TRUCK-11", label: "TRUCK-11" },
  { value: "MINI-03", label: "MINI-03" },
]

const serviceTypes = [
  { value: "", label: "Select service" },
  { value: "Oil Change", label: "Oil Change" },
  { value: "Tyre Replace", label: "Tyre Replace" },
  { value: "Engine Repair", label: "Engine Repair" },
  { value: "Routine Inspection", label: "Routine Inspection" },
]

export function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockRecords)
  const [form, setForm] = useState({
    vehicle: "",
    service_type: "",
    cost: "",
    date: "",
    status: "Active",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.vehicle) newErrors.vehicle = "Select vehicle"
    if (!form.service_type) newErrors.service_type = "Select service type"
    if (!form.cost || Number(form.cost) <= 0) newErrors.cost = "Enter valid cost"
    if (!form.date) newErrors.date = "Select date"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const newRecord: MaintenanceRecord = {
      id: Date.now(),
      date: form.date,
      vehicle: form.vehicle,
      service_type: form.service_type,
      cost: Number(form.cost),
      status: form.status as "Active" | "Completed",
      notes: form.notes,
    }
    setRecords(prev => [newRecord, ...prev])
    setForm({ vehicle: "", service_type: "", cost: "", date: "", status: "Active", notes: "" })
    toast.success("Maintenance record saved")
    setIsSubmitting(false)
  }

  const handleClose = (id: number) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, status: "Completed" as const } : r)))
    toast.success("Record marked as completed")
  }

  const totalCost = useMemo(() => records.reduce((sum, r) => sum + r.cost, 0), [records])

  const columns: Column<MaintenanceRecord>[] = [
    { key: "date", header: "Date", render: r => <span className="text-[var(--brand-ink-muted)]">{r.date}</span> },
    { key: "vehicle", header: "Vehicle", render: r => <span className="font-medium">{r.vehicle}</span> },
    { key: "service_type", header: "Service", render: r => <span className="text-[var(--brand-ink-muted)]">{r.service_type}</span> },
    { key: "cost", header: "Cost", align: "right", render: r => <span className="font-mono">₹{r.cost.toLocaleString("en-IN")}</span> },
    { key: "status", header: "Status", render: r => <StatusBadge status={r.status} variant={r.status === "Active" ? "in_maintenance" : "completed"} /> },
    {
      key: "actions",
      header: "",
      render: r =>
        r.status === "Active" ? (
          <Button variant="secondary" size="sm" onClick={() => handleClose(r.id)}>
            Close
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Maintenance" subtitle="Log and track vehicle service records.">
        <Button variant="secondary" leftIcon={<Download size={18} />}>
          Export Log
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-lg)]">
        <div className="lg:col-span-4 space-y-[var(--space-md)]">
          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-5 flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
              <Wrench size={18} className="text-[var(--brand-primary)]" />
              Log Service Record
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Vehicle"
                value={form.vehicle}
                onChange={e => updateField("vehicle", e.target.value)}
                options={vehicles}
                error={errors.vehicle}
              />
              <Select
                label="Service Type"
                value={form.service_type}
                onChange={e => updateField("service_type", e.target.value)}
                options={serviceTypes}
                error={errors.service_type}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cost (₹)"
                  type="number"
                  value={form.cost}
                  onChange={e => updateField("cost", e.target.value)}
                  error={errors.cost}
                  placeholder="0.00"
                />
                <Input
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={e => updateField("date", e.target.value)}
                  error={errors.date}
                />
              </div>
              <Select
                label="Status"
                value={form.status}
                onChange={e => updateField("status", e.target.value)}
                options={[
                  { value: "Active", label: "In Shop" },
                  { value: "Completed", label: "Completed" },
                ]}
              />
              <div>
                <label className="block mb-1.5 font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => updateField("notes", e.target.value)}
                  placeholder="Optional details..."
                  rows={3}
                  className={cn(
                    "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)] px-3 py-2",
                    "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                    "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] resize-none"
                  )}
                  style={{ fontSize: "var(--text-body-sm)" }}
                />
              </div>
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Save Record
              </Button>
            </form>
          </Card>

          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 flex items-start gap-3">
            <Info size={20} className="text-[var(--destructive)] mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-[var(--destructive)] mb-1" style={{ fontSize: "var(--text-caption)" }}>Status Note</h4>
              <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                Vehicles marked as <strong className="text-[var(--brand-ink)]">"In Shop"</strong> are automatically removed from the active dispatch pool until marked Completed.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                Service Log
              </h3>
              <button className="p-1.5 text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)] hover:bg-[var(--brand-canvas-soft)] rounded-[var(--radius-md)] transition-colors">
                <Filter size={18} />
              </button>
            </div>
            <div className="flex-1">
              <DataTable columns={columns} data={records} keyExtractor={r => r.id} />
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
              <span>Total maintenance cost</span>
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                ₹{totalCost.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
