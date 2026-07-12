import { apiClient } from "./client"
import type { AppSettingResponse, AppSettingUpdate } from "./types"

export const getSettings = async () => {
  const response = await apiClient.get<AppSettingResponse>("/api/settings")
  return response.data
}

export const updateSettings = async (data: AppSettingUpdate) => {
  const response = await apiClient.put<AppSettingResponse>("/api/settings", data)
  return response.data
}
