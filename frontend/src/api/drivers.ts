import { apiClient } from "./client"
import type { DriverCreate, DriverResponse, DriverUpdate } from "./types"

export const getAvailableDrivers = async () => {
  const response = await apiClient.get<DriverResponse[]>("/api/drivers/available")
  return response.data
}

export const getDrivers = async (params?: {
  skip?: number
  limit?: number
  status?: string
  search?: string
}) => {
  const response = await apiClient.get<DriverResponse[]>("/api/drivers/", { params })
  return response.data
}

export const createDriver = async (data: DriverCreate) => {
  const response = await apiClient.post<DriverResponse>("/api/drivers/", data)
  return response.data
}

export const getDriver = async (driverId: number) => {
  const response = await apiClient.get<DriverResponse>(`/api/drivers/${driverId}`)
  return response.data
}

export const updateDriver = async (driverId: number, data: DriverUpdate) => {
  const response = await apiClient.put<DriverResponse>(`/api/drivers/${driverId}`, data)
  return response.data
}

export const deleteDriver = async (driverId: number) => {
  const response = await apiClient.delete<DriverResponse>(`/api/drivers/${driverId}`)
  return response.data
}
