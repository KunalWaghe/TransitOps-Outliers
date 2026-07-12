import { apiClient } from "./client"
import type { UserResponse, UserCreate, UserUpdate } from "./types"

export const getUsers = async () => {
  const response = await apiClient.get<UserResponse[]>("/api/users")
  return response.data
}

export const createUser = async (data: UserCreate) => {
  const response = await apiClient.post<UserResponse>("/api/users", data)
  return response.data
}

export const updateUser = async (userId: number, data: UserUpdate) => {
  const response = await apiClient.put<UserResponse>(`/api/users/${userId}`, data)
  return response.data
}

export const deleteUser = async (userId: number) => {
  const response = await apiClient.delete<{ message?: string }>(`/api/users/${userId}`)
  return response.data
}
