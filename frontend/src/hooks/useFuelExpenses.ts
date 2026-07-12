import { useMemo, useState } from "react"
import toast from "react-hot-toast"

export interface FuelLog {
  id: number
  vehicle: string
  date: string
  liters: number
  cost: number
  odometer_km: number
}

export interface Expense {
  id: number
  trip_id: string
  vehicle: string
  toll: number
  other: number
  maintenance: number
  total: number
  status: string
}

export const mockFuelLogs: FuelLog[] = [
  { id: 1, vehicle: "VAN-05", date: "2026-07-05", liters: 42, cost: 3150, odometer_km: 45200 },
  { id: 2, vehicle: "TRUCK-11", date: "2026-07-06", liters: 110, cost: 8400, odometer_km: 128500 },
  { id: 3, vehicle: "MINI-03", date: "2026-07-06", liters: 28, cost: 2050, odometer_km: 32100 },
  { id: 4, vehicle: "VAN-08", date: "2026-07-07", liters: 50, cost: 3750, odometer_km: 28000 },
]

export const mockExpenses: Expense[] = [
  { id: 1, trip_id: "TR001", vehicle: "VAN-05", toll: 120, other: 0, maintenance: 0, total: 120, status: "Available" },
  { id: 2, trip_id: "TR002", vehicle: "TRX-12", toll: 340, other: 150, maintenance: 18000, total: 18490, status: "Completed" },
]

export const vehicles = [
  { value: "", label: "Select vehicle" },
  { value: "VAN-05", label: "VAN-05" },
  { value: "TRUCK-11", label: "TRUCK-11" },
  { value: "MINI-03", label: "MINI-03" },
  { value: "VAN-08", label: "VAN-08" },
]

export const expenseCategories = [
  { value: "toll", label: "Toll" },
  { value: "misc", label: "Miscellaneous" },
  { value: "maintenance", label: "Maintenance Linked" },
]

export function useFuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(mockFuelLogs)
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [fuelForm, setFuelForm] = useState({ vehicle: "", date: "", liters: "", cost: "", odometer_km: "" })
  const [expenseForm, setExpenseForm] = useState({ trip_id: "", vehicle: "", category: "toll", amount: "", description: "" })
  const [activeTab, setActiveTab] = useState<"fuel" | "expense">("fuel")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalFuelCost = useMemo(() => fuelLogs.reduce((sum, f) => sum + f.cost, 0), [fuelLogs])
  const totalExpenseCost = useMemo(() => expenses.reduce((sum, e) => sum + e.total, 0), [expenses])
  const totalOperationalCost = totalFuelCost + totalExpenseCost

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fuelForm.vehicle || !fuelForm.date || !fuelForm.liters || !fuelForm.cost) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    const newLog: FuelLog = {
      id: Date.now(),
      vehicle: fuelForm.vehicle,
      date: fuelForm.date,
      liters: Number(fuelForm.liters),
      cost: Number(fuelForm.cost),
      odometer_km: Number(fuelForm.odometer_km) || 0,
    }
    setFuelLogs(prev => [newLog, ...prev])
    setFuelForm({ vehicle: "", date: "", liters: "", cost: "", odometer_km: "" })
    toast.success("Fuel log added")
    setIsSubmitting(false)
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expenseForm.vehicle || !expenseForm.amount) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    const amount = Number(expenseForm.amount)
    const newExpense: Expense = {
      id: Date.now(),
      trip_id: expenseForm.trip_id || "N/A",
      vehicle: expenseForm.vehicle,
      toll: expenseForm.category === "toll" ? amount : 0,
      other: expenseForm.category === "misc" ? amount : 0,
      maintenance: expenseForm.category === "maintenance" ? amount : 0,
      total: amount,
      status: "Completed",
    }
    setExpenses(prev => [newExpense, ...prev])
    setExpenseForm({ trip_id: "", vehicle: "", category: "toll", amount: "", description: "" })
    toast.success("Expense added")
    setIsSubmitting(false)
  }

  const highestSpenders = useMemo(() => {
    const map = new Map<string, number>()
    fuelLogs.forEach(f => map.set(f.vehicle, (map.get(f.vehicle) || 0) + f.cost))
    expenses.forEach(e => map.set(e.vehicle, (map.get(e.vehicle) || 0) + e.total))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [fuelLogs, expenses])

  const maxSpender = highestSpenders[0]?.[1] || 1

  return {
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
    totalExpenseCost,
    totalOperationalCost,
    handleFuelSubmit,
    handleExpenseSubmit,
    highestSpenders,
    maxSpender,
  }
}
