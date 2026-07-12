import axios from "axios"
import { getAuthToken } from "@/utils/storage"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
