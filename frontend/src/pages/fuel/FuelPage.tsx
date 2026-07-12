import { useState, useMemo } from "react"
import { AlertTriangle, Fuel } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { Input } from "@/components/shared/Input"
import { Modal } from "@/components/shared/Modal"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"
import {
  useFuelExpenses,
  type FuelLog,
} from "@/hooks/useFuelExpenses"

export function FuelPage() {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false)

  const {
    fuelLogs,
    fuelForm,
    setFuelForm,
    isSubmittingFuel,
    isLoading,
    totalFuelCost,
    handleFuelSubmit,
    vehicles,
  } = useFuelExpenses()

  const onFuelSubmit = async (e: React.FormEvent) => {
    try {
      await handleFuelSubmit(e)
      setIsFuelModalOpen(false)
    } catch {
      // Error toast handled in hook
    }
  }

  const fuelColumns: Column<FuelLog>[] = [
    { key: "vehicle", header: "Vehicle", render: f => <span className="font-medium text-[var(--brand-primary)]">{f.vehicle}</span> },
    { key: "date", header: "Date", sortValue: f => f.date, render: f => <span className="text-[var(--brand-ink-muted)]">{formatDate(f.date)}</span> },
    { key: "liters", header: "Liters", sortValue: f => f.liters, render: f => <span>{f.liters} L</span> },
    { key: "cost", header: "Fuel Cost", align: "right", sortValue: f => f.cost, render: f => <span>₹{f.cost.toLocaleString("en-IN")}</span> },
  ]

  const highestFuelSpenders = useMemo(() => {
    const map = new Map<string, number>()
    fuelLogs.forEach(f => map.set(f.vehicle, (map.get(f.vehicle) || 0) + f.cost))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [fuelLogs])

  const maxFuelSpender = highestFuelSpenders[0]?.[1] || 1

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Fuel Logs" subtitle="Log and monitor fuel consumption and costs across the fleet.">
        <Button
          variant="primary"
          leftIcon={<Fuel size={18} />}
          onClick={() => setIsFuelModalOpen(true)}
        >
          Log Fuel
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-lg)]">
        <div className="lg:col-span-2 space-y-[var(--space-md)]">
          <Card className="flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--brand-ink)] flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
                <Fuel size={18} className="text-[var(--brand-ink-muted)]" />
                Fuel Logs
              </h3>
            </div>
            {fuelLogs.length > 0 ? (
              <DataTable
                columns={fuelColumns}
                data={fuelLogs}
                keyExtractor={f => f.id}
                isLoading={isLoading}
                defaultSort={{ key: "date", direction: "desc" }}
              />
            ) : (
              <EmptyState />
            )}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>Total Fuel Cost</span>
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                ₹{totalFuelCost.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-[var(--space-md)]">
          <Card>
            <h3 className="text-[var(--brand-ink-muted)] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-caption)" }}>
              Current Month Fuel Burn
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-heading-1)" }}>
                ₹{totalFuelCost.toLocaleString("en-IN")}
              </span>
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>/ 30k Budget</span>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-2">
              <div className="bg-[var(--brand-primary)] h-1.5 rounded-full" style={{ width: `${Math.min((totalFuelCost / 30000) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
              <span>0%</span>
              <span>On Track</span>
              <span>100%</span>
            </div>
          </Card>

          <Card className="flex flex-col">
            <h3 className="text-[var(--brand-ink-muted)] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-caption)" }}>
              Highest Fuel Spenders
            </h3>
            <div className="space-y-5 mt-2 flex-1">
              {highestFuelSpenders.map(([vehicle, cost], idx) => (
                <div key={vehicle} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[var(--brand-primary)] group-hover:underline" style={{ fontSize: "var(--text-body-sm)" }}>
                      {vehicle}
                    </span>
                    <span className="text-[var(--brand-ink)]" style={{ fontSize: "var(--text-body-sm)" }}>
                      ₹{cost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--border)] rounded-full h-1">
                    <div
                      className={cn("h-1 rounded-full transition-opacity", idx === 0 ? "bg-[#dd5b00]" : idx === 1 ? "bg-[#eab308]" : "bg-[var(--brand-primary)]")}
                      style={{ width: `${Math.max((cost / maxFuelSpender) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-[var(--brand-ink-muted)] flex items-start gap-1" style={{ fontSize: "var(--text-caption)" }}>
                <AlertTriangle size={14} className="text-[#dd5b00] mt-0.5 shrink-0" />
                TRUCK-11 fuel efficiency has dropped by 12% over the last 30 days. Service recommended.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Log Fuel">
        <form onSubmit={onFuelSubmit} className="space-y-4">
          <Select
            label="Vehicle"
            value={fuelForm.vehicle_id}
            onChange={e => setFuelForm(prev => ({ ...prev, vehicle_id: e.target.value }))}
            options={vehicles}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Liters"
              type="number"
              value={fuelForm.liters}
              onChange={e => setFuelForm(prev => ({ ...prev, liters: e.target.value }))}
              placeholder="42"
            />
            <Input
              label="Cost (₹)"
              type="number"
              value={fuelForm.cost}
              onChange={e => setFuelForm(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="3150"
            />
          </div>
          <Input
            label="Odometer (km)"
            type="number"
            value={fuelForm.odometer_km}
            onChange={e => setFuelForm(prev => ({ ...prev, odometer_km: e.target.value }))}
            placeholder="45200"
          />
          <Button type="submit" isLoading={isSubmittingFuel} className="w-full" leftIcon={<Fuel size={18} />}>
            Log Fuel
          </Button>
        </form>
      </Modal>
    </div>
  )
}
