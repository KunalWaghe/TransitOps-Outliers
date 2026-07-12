import { AlertTriangle, Fuel, Receipt } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/utils/format"
import { cn } from "@/lib/utils"
import {
  useFuelExpenses,
  vehicles,
  expenseCategories,
  type FuelLog,
  type Expense,
} from "@/hooks/useFuelExpenses"

export function FuelExpensesPage() {
  const {
    fuelLogs,
    expenses,
    fuelForm,
    setFuelForm,
    expenseForm,
    setExpenseForm,
    activeTab,
    setActiveTab,
    isSubmitting,
    totalFuelCost,
    totalOperationalCost,
    handleFuelSubmit,
    handleExpenseSubmit,
    highestSpenders,
    maxSpender,
  } = useFuelExpenses()

  const fuelColumns: Column<FuelLog>[] = [
    { key: "vehicle", header: "Vehicle", render: f => <span className="font-medium text-[var(--brand-primary)]">{f.vehicle}</span> },
    { key: "date", header: "Date", render: f => <span className="text-[var(--brand-ink-muted)]">{formatDate(f.date)}</span> },
    { key: "liters", header: "Liters", render: f => <span>{f.liters} L</span> },
    { key: "cost", header: "Fuel Cost", align: "right", render: f => <span>₹{f.cost.toLocaleString("en-IN")}</span> },
  ]

  const expenseColumns: Column<Expense>[] = [
    { key: "trip_id", header: "Trip", render: e => <span className="text-[var(--brand-ink-muted)]">{e.trip_id}</span> },
    { key: "vehicle", header: "Vehicle", render: e => <span className="font-medium text-[var(--brand-primary)]">{e.vehicle}</span> },
    { key: "toll", header: "Toll", render: e => <span>{e.toll}</span> },
    { key: "other", header: "Other", render: e => <span>{e.other}</span> },
    { key: "maintenance", header: "Maint. (Linked)", render: e => <span>{e.maintenance}</span> },
    { key: "total", header: "Total", align: "right", render: e => <StatusBadge status={e.status} variant="completed" /> },
  ]

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Fuel & Expenses" subtitle="Log and monitor operational costs across the fleet.">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "expense" ? "primary" : "secondary"}
            leftIcon={<Receipt size={18} />}
            onClick={() => setActiveTab("expense")}
          >
            Add Expense
          </Button>
          <Button
            variant={activeTab === "fuel" ? "primary" : "secondary"}
            leftIcon={<Fuel size={18} />}
            onClick={() => setActiveTab("fuel")}
          >
            Log Fuel
          </Button>
        </div>
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
            {fuelLogs.length > 0 ? <DataTable columns={fuelColumns} data={fuelLogs} keyExtractor={f => f.id} /> : <EmptyState />}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>Total Fuel Cost</span>
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                ₹{totalFuelCost.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>

          <Card className="flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--brand-ink)] flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
                <Receipt size={18} className="text-[var(--brand-ink-muted)]" />
                Other Expenses (Toll / Misc)
              </h3>
            </div>
            {expenses.length > 0 ? <DataTable columns={expenseColumns} data={expenses} keyExtractor={e => e.id} /> : <EmptyState />}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                Total Operational Cost (Auto) = Fuel + Maintenance
              </span>
              <span className="font-semibold text-[#dd5b00]" style={{ fontSize: "var(--text-title)" }}>
                ₹{totalOperationalCost.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-[var(--space-md)]">
          <Card>
            <h3 className="text-[var(--brand-ink-muted)] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-caption)" }}>
              Current Month Burn
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-heading-1)" }}>
                ₹{totalOperationalCost.toLocaleString("en-IN")}
              </span>
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>/ 50k Budget</span>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-2">
              <div className="bg-[var(--brand-primary)] h-1.5 rounded-full" style={{ width: `${Math.min((totalOperationalCost / 50000) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
              <span>0%</span>
              <span>On Track</span>
              <span>100%</span>
            </div>
          </Card>

          <Card className="flex flex-col">
            <h3 className="text-[var(--brand-ink-muted)] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-caption)" }}>
              Highest Spenders
            </h3>
            <div className="space-y-5 mt-2 flex-1">
              {highestSpenders.map(([vehicle, cost], idx) => (
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
                      style={{ width: `${Math.max((cost / maxSpender) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-[var(--brand-ink-muted)] flex items-start gap-1" style={{ fontSize: "var(--text-caption)" }}>
                <AlertTriangle size={14} className="text-[#dd5b00] mt-0.5 shrink-0" />
                TRUCK-11 maintenance costs are 40% above fleet average for this quarter. Recommended inspection.
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4" style={{ fontSize: "var(--text-title)" }}>
              {activeTab === "fuel" ? "Log Fuel" : "Add Expense"}
            </h3>
            {activeTab === "fuel" ? (
              <form onSubmit={handleFuelSubmit} className="space-y-4">
                <Select
                  label="Vehicle"
                  value={fuelForm.vehicle}
                  onChange={e => setFuelForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  options={vehicles}
                />
                <Input
                  label="Date"
                  type="date"
                  value={fuelForm.date}
                  onChange={e => setFuelForm(prev => ({ ...prev, date: e.target.value }))}
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
                <Button type="submit" isLoading={isSubmitting} className="w-full" leftIcon={<Fuel size={18} />}>
                  Log Fuel
                </Button>
              </form>
            ) : (
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <Input
                  label="Trip ID"
                  value={expenseForm.trip_id}
                  onChange={e => setExpenseForm(prev => ({ ...prev, trip_id: e.target.value }))}
                  placeholder="TR001"
                />
                <Select
                  label="Vehicle"
                  value={expenseForm.vehicle}
                  onChange={e => setExpenseForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  options={vehicles}
                />
                <Select
                  label="Category"
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                  options={expenseCategories}
                />
                <Input
                  label="Amount (₹)"
                  type="number"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="120"
                />
                <div>
                  <label className="block mb-1.5 font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                    Description
                  </label>
                  <textarea
                    value={expenseForm.description}
                    onChange={e => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional"
                    rows={2}
                    className={cn(
                      "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)] px-3 py-2",
                      "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                      "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] resize-none"
                    )}
                    style={{ fontSize: "var(--text-body-sm)" }}
                  />
                </div>
                <Button type="submit" isLoading={isSubmitting} className="w-full" leftIcon={<Receipt size={18} />}>
                  Add Expense
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
