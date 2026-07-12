import { apiClient } from "./client"
import type { TripCreate, TripResponse, TripComplete } from "./types"

export const getTrips = async (params?: {
  skip?: number
  limit?: number
  status?: string
}) => {
  const response = await apiClient.get<TripResponse[]>("/api/trips/", { params })
  return response.data
}

export const createTrip = async (data: TripCreate) => {
  const response = await apiClient.post<TripResponse>("/api/trips/", data)
  return response.data
}

export const getTrip = async (tripId: number) => {
  const response = await apiClient.get<TripResponse>(`/api/trips/${tripId}`)
  return response.data
}

export const dispatchTrip = async (tripId: number) => {
  const response = await apiClient.post<TripResponse>(`/api/trips/${tripId}/dispatch`)
  return response.data
}

export const completeTrip = async (tripId: number, data: TripComplete) => {
  const response = await apiClient.post<TripResponse>(`/api/trips/${tripId}/complete`, data)
  return response.data
}

export const cancelTrip = async (tripId: number) => {
  const response = await apiClient.post<TripResponse>(`/api/trips/${tripId}/cancel`)
  return response.data
}
