import { apiClient } from "./client"
import type { FuelLogCreate, FuelLogResponse } from "./types"

export const getFuelLogs = async () => {
  const response = await apiClient.get<FuelLogResponse[]>("/api/fuel-logs")
  return response.data
}

export const createFuelLog = async (data: FuelLogCreate) => {
  const response = await apiClient.post<FuelLogResponse>("/api/fuel-logs", data)
  return response.data
}
