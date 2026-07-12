import { apiClient } from "./client"

// Since openapi.json schemas for dashboard are empty `{}`, we define generic ones
// or `any` if we don't know the shape yet.
export const getDashboardKpis = async () => {
  const response = await apiClient.get<any>("/api/dashboard/kpis")
  return response.data
}

export const getDashboardCharts = async () => {
  const response = await apiClient.get<any>("/api/dashboard/charts")
  return response.data
}
