import { apiClient } from "./client"
import type { VehicleCreate, VehicleResponse, VehicleUpdate } from "./types"

const DEFAULT_VEHICLE_LIST_LIMIT = 1000

export const getAvailableVehicles = async () => {
  const response = await apiClient.get<VehicleResponse[]>("/api/vehicles/available")
  return response.data
}

export const getVehicles = async (params?: {
  skip?: number
  limit?: number
  status?: string
  type?: string
  search?: string
}) => {
  const response = await apiClient.get<VehicleResponse[]>("/api/vehicles/", {
    params: { ...params, limit: params?.limit ?? DEFAULT_VEHICLE_LIST_LIMIT },
  })
  return response.data
}

export const createVehicle = async (data: VehicleCreate) => {
  const response = await apiClient.post<VehicleResponse>("/api/vehicles/", data)
  return response.data
}

export const getVehicle = async (vehicleId: number) => {
  const response = await apiClient.get<VehicleResponse>(`/api/vehicles/${vehicleId}`)
  return response.data
}

export const updateVehicle = async (vehicleId: number, data: VehicleUpdate) => {
  const response = await apiClient.put<VehicleResponse>(`/api/vehicles/${vehicleId}`, data)
  return response.data
}

export const deleteVehicle = async (vehicleId: number) => {
  const response = await apiClient.delete<VehicleResponse>(`/api/vehicles/${vehicleId}`)
  return response.data
}
