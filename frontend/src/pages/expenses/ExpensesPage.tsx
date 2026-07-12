import { useState, useMemo } from "react"
import { AlertTriangle, Receipt } from "lucide-react"
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
  type Expense,
} from "@/hooks/useFuelExpenses"

export function ExpensesPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  const {
    expenses,
    expenseForm,
    setExpenseForm,
    isSubmittingExpense,
    isLoading,
    totalExpenseCost,
    handleExpenseSubmit,
    vehicles,
    expenseCategories,
  } = useFuelExpenses()

  const onExpenseSubmit = async (e: React.FormEvent) => {
    try {
      await handleExpenseSubmit(e)
      setIsExpenseModalOpen(false)
    } catch {
      // Error toast handled in hook
    }
  }

  const expenseColumns: Column<Expense>[] = [
    { key: "date", header: "Date", sortValue: e => e.date, render: e => <span className="text-[var(--brand-ink-muted)]">{formatDate(e.date)}</span> },
    { key: "vehicle", header: "Vehicle", render: e => <span className="font-medium text-[var(--brand-primary)]">{e.vehicle}</span> },
    { key: "category", header: "Category", render: e => <span className="capitalize">{e.category}</span> },
    { key: "description", header: "Description", sortValue: e => e.description ?? "", render: e => <span>{e.description || "-"}</span> },
    { key: "amount", header: "Amount", align: "right", sortValue: e => e.amount, render: e => <span className="font-semibold text-[var(--brand-ink)]">₹{e.amount.toLocaleString("en-IN")}</span> },
  ]

  const highestExpenseSpenders = useMemo(() => {
    const map = new Map<string, number>()
    expenses.forEach(e => map.set(e.vehicle, (map.get(e.vehicle) || 0) + e.amount))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [expenses])

  const maxExpenseSpender = highestExpenseSpenders[0]?.[1] || 1

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Expenses" subtitle="Track and manage toll, maintenance, and miscellaneous fleet expenses.">
        <Button
          variant="primary"
          leftIcon={<Receipt size={18} />}
          onClick={() => setIsExpenseModalOpen(true)}
        >
          Add Expense
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-lg)]">
        <div className="lg:col-span-2 space-y-[var(--space-md)]">
          <Card className="flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--brand-ink)] flex items-center gap-2" style={{ fontSize: "var(--text-title)" }}>
                <Receipt size={18} className="text-[var(--brand-ink-muted)]" />
                Other Expenses (Toll / Misc)
              </h3>
            </div>
            {expenses.length > 0 ? (
              <DataTable
                columns={expenseColumns}
                data={expenses}
                keyExtractor={e => e.id}
                isLoading={isLoading}
                defaultSort={{ key: "date", direction: "desc" }}
              />
            ) : (
              <EmptyState />
            )}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>Total Expenses Cost</span>
              <span className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                ₹{totalExpenseCost.toLocaleString("en-IN")}
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
                ₹{totalExpenseCost.toLocaleString("en-IN")}
              </span>
              <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>/ 20k Budget</span>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-2">
              <div className="bg-[var(--brand-primary)] h-1.5 rounded-full" style={{ width: `${Math.min((totalExpenseCost / 20000) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
              <span>0%</span>
              <span>On Track</span>
              <span>100%</span>
            </div>
          </Card>

          <Card className="flex flex-col">
            <h3 className="text-[var(--brand-ink-muted)] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-caption)" }}>
              Highest Spenders (Expenses)
            </h3>
            <div className="space-y-5 mt-2 flex-1">
              {highestExpenseSpenders.map(([vehicle, cost], idx) => (
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
                      style={{ width: `${Math.max((cost / maxExpenseSpender) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-[var(--brand-ink-muted)] flex items-start gap-1" style={{ fontSize: "var(--text-caption)" }}>
                <AlertTriangle size={14} className="text-[#dd5b00] mt-0.5 shrink-0" />
                Toll charges on Route A have increased by 15% this month. Consider optimizing routes.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense">
        <form onSubmit={onExpenseSubmit} className="space-y-4">
          <Select
            label="Vehicle"
            value={expenseForm.vehicle_id}
            onChange={e => setExpenseForm(prev => ({ ...prev, vehicle_id: e.target.value }))}
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
          <Button type="submit" isLoading={isSubmittingExpense} className="w-full" leftIcon={<Receipt size={18} />}>
            Add Expense
          </Button>
        </form>
      </Modal>
    </div>
  )
}
