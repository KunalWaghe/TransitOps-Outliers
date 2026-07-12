import { apiClient } from "./client"
import type { MaintenanceCreate, MaintenanceResponse } from "./types"

export const getMaintenanceLogs = async (params?: {
  skip?: number
  limit?: number
  vehicle_id?: number
  status?: string
}) => {
  const response = await apiClient.get<MaintenanceResponse[]>("/api/maintenance/", { params })
  return response.data
}

export const createMaintenanceLog = async (data: MaintenanceCreate) => {
  const response = await apiClient.post<MaintenanceResponse>("/api/maintenance/", data)
  return response.data
}

export const closeMaintenanceLog = async (logId: number) => {
  const response = await apiClient.post<MaintenanceResponse>(`/api/maintenance/${logId}/close`)
  return response.data
}
