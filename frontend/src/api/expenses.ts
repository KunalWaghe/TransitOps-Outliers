import { apiClient } from "./client"
import type { ExpenseCreate, ExpenseResponse } from "./types"

export const getExpenses = async () => {
  const response = await apiClient.get<ExpenseResponse[]>("/api/expenses")
  return response.data
}

export const createExpense = async (data: ExpenseCreate) => {
  const response = await apiClient.post<ExpenseResponse>("/api/expenses", data)
  return response.data
}
