import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFuelLogs, createFuelLog } from "@/api/fuel"
import { getExpenses, createExpense } from "@/api/expenses"
import { getVehicles } from "@/api/vehicles"
import type { FuelLogCreate, FuelLogResponse, ExpenseCreate, ExpenseResponse } from "@/api/types"

export interface FuelLog extends FuelLogResponse {
  vehicle: string
}

export interface Expense extends ExpenseResponse {
  vehicle: string
}

export const expenseCategories = [
  { value: "toll", label: "Toll" },
  { value: "misc", label: "Miscellaneous" },
  { value: "maintenance", label: "Maintenance Linked" },
]

export function useFuelExpenses() {
  const queryClient = useQueryClient()
  const [fuelForm, setFuelForm] = useState({ vehicle_id: "", liters: "", cost: "", odometer_km: "" })
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: "", category: "toll", amount: "", description: "" })
  const [activeTab, setActiveTab] = useState<"fuel" | "expense">("fuel")

  const { data: rawFuelLogs = [], isLoading: isLoadingFuel } = useQuery({ queryKey: ["fuel"], queryFn: () => getFuelLogs() })
  const { data: rawExpenses = [], isLoading: isLoadingExpenses } = useQuery({ queryKey: ["expenses"], queryFn: () => getExpenses() })
  const { data: vehiclesData = [] } = useQuery({ queryKey: ["vehicles"], queryFn: () => getVehicles() })

  const vehicles = useMemo(() => {
    return [
      { value: "", label: "Select vehicle" },
      ...vehiclesData.map(v => ({ value: String(v.id), label: v.registration_number }))
    ]
  }, [vehiclesData])

  const fuelLogs: FuelLog[] = useMemo(() => rawFuelLogs.map(f => ({
    ...f,
    vehicle: vehiclesData.find(v => v.id === f.vehicle_id)?.registration_number || `Vehicle ${f.vehicle_id}`
  })), [rawFuelLogs, vehiclesData])

  const expenses: Expense[] = useMemo(() => rawExpenses.map(e => ({
    ...e,
    vehicle: vehiclesData.find(v => v.id === e.vehicle_id)?.registration_number || `Vehicle ${e.vehicle_id}`
  })), [rawExpenses, vehiclesData])

  const totalFuelCost = useMemo(() => fuelLogs.reduce((sum, f) => sum + f.cost, 0), [fuelLogs])
  const totalExpenseCost = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])
  const totalOperationalCost = totalFuelCost + totalExpenseCost

  const fuelMutation = useMutation({
    mutationFn: (data: FuelLogCreate) => createFuelLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel"] })
      toast.success("Fuel log added")
      setFuelForm({ vehicle_id: "", liters: "", cost: "", odometer_km: "" })
    },
    onError: () => toast.error("Failed to add fuel log")
  })

  const expenseMutation = useMutation({
    mutationFn: (data: ExpenseCreate) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      toast.success("Expense added")
      setExpenseForm({ vehicle_id: "", category: "toll", amount: "", description: "" })
    },
    onError: () => toast.error("Failed to add expense")
  })

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fuelForm.vehicle_id || !fuelForm.liters || !fuelForm.cost) return

    fuelMutation.mutate({
      vehicle_id: Number(fuelForm.vehicle_id),
      liters: Number(fuelForm.liters),
      cost: Number(fuelForm.cost),
      odometer_km: Number(fuelForm.odometer_km) || 0,
    })
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expenseForm.vehicle_id || !expenseForm.amount) return

    expenseMutation.mutate({
      vehicle_id: Number(expenseForm.vehicle_id),
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      description: expenseForm.description || null,
    })
  }

  const highestSpenders = useMemo(() => {
    const map = new Map<string, number>()
    fuelLogs.forEach(f => map.set(f.vehicle, (map.get(f.vehicle) || 0) + f.cost))
    expenses.forEach(e => map.set(e.vehicle, (map.get(e.vehicle) || 0) + e.amount))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [fuelLogs, expenses])

  const maxSpender = highestSpenders[0]?.[1] || 1
  const isLoading = isLoadingFuel || isLoadingExpenses

  return {
    fuelLogs,
    expenses,
    fuelForm,
    setFuelForm,
    expenseForm,
    setExpenseForm,
    activeTab,
    setActiveTab,
    isSubmitting: fuelMutation.isPending || expenseMutation.isPending,
    isLoading,
    totalFuelCost,
    totalExpenseCost,
    totalOperationalCost,
    handleFuelSubmit,
    handleExpenseSubmit,
    highestSpenders,
    maxSpender,
    vehicles,
    expenseCategories,
  }
}
