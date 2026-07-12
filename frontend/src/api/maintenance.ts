import { apiClient } from "./client"
import type { MaintenanceCreate, MaintenanceResponse } from "./types"

async function downloadMaintenanceCsv(): Promise<void> {
  const response = await apiClient.get("/api/maintenance/export/csv", {
    responseType: "blob",
  })

  const blob = new Blob([response.data], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "maintenance_log.csv"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url)
}

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

export const exportMaintenanceCsv = async () => {
  return downloadMaintenanceCsv()
}
