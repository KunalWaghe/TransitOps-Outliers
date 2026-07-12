import { Download, Filter, Info, Wrench } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"
import {
  useMaintenance,
  type MaintenanceRecord,
} from "@/hooks/useMaintenance"

export function MaintenancePage() {
  const {
    records,
    form,
    errors,
    isSubmitting,
    isLoading,
    updateField,
    handleSubmit,
    handleClose,
    totalCost,
    vehicles,
    serviceTypes,
  } = useMaintenance()

  const columns: Column<MaintenanceRecord>[] = [
    { key: "date", header: "Date", sortValue: r => r.date, render: r => <span className="text-[var(--brand-ink-muted)]">{r.date}</span> },
    { key: "vehicle", header: "Vehicle", render: r => <span className="font-medium">{r.vehicle}</span> },
    { key: "service_type", header: "Service", render: r => <span className="text-[var(--brand-ink-muted)]">{r.service_type}</span> },
    { key: "cost", header: "Cost", align: "right", sortValue: r => r.cost, render: r => <span className="font-mono">₹{r.cost.toLocaleString("en-IN")}</span> },
    { key: "status", header: "Status", render: r => <StatusBadge status={r.status || "Unknown"} variant={r.status === "Active" ? "in_maintenance" : "completed"} /> },
    {
      key: "actions",
      header: "",
      sortable: false,
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
                value={form.vehicle_id}
                onChange={e => updateField("vehicle_id", e.target.value)}
                options={vehicles}
                error={errors.vehicle_id}
              />
              <Select
                label="Service Type"
                value={form.type}
                onChange={e => updateField("type", e.target.value)}
                options={serviceTypes}
                error={errors.type}
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
                <Select
                  label="Status"
                  value={form.status}
                  onChange={e => updateField("status", e.target.value)}
                  options={[
                    { value: "Active", label: "In Shop" },
                    { value: "Closed", label: "Closed" },
                  ]}
                />
              </div>
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
              <DataTable
                columns={columns}
                data={records}
                keyExtractor={r => r.id}
                isLoading={isLoading}
                defaultSort={{ key: "date", direction: "desc" }}
              />
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
