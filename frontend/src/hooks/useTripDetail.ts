import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export interface Trip {
  id: number
  trip_id: string
  source: string
  destination: string
  vehicle: string
  driver: string
  cargo_weight_kg: number
  planned_distance_km: number
  actual_distance_km?: number
  fuel_consumed_liters?: number
  revenue?: number
  status: string
  created_at: string
  dispatched_at?: string
  completed_at?: string
}

export const mockTrip: Trip = {
  id: 1,
  trip_id: "TR-8429",
  source: "Seattle North Terminal",
  destination: "Portland South Depot",
  vehicle: "TX-882 (Volvo VNL)",
  driver: "Sarah Jenkins",
  cargo_weight_kg: 32500,
  planned_distance_km: 450,
  actual_distance_km: 0,
  fuel_consumed_liters: 0,
  revenue: 125000,
  status: "Draft",
  created_at: "2026-07-12T09:00:00Z",
}

export function useTripDetail() {
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip>(mockTrip)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDispatch = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setTrip(prev => ({ ...prev, status: "Dispatched", dispatched_at: new Date().toISOString() }))
    toast.success("Trip dispatched")
    setIsLoading(false)
  }

  const handleComplete = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setTrip(prev => ({
      ...prev,
      status: "Completed",
      completed_at: new Date().toISOString(),
      actual_distance_km: prev.planned_distance_km,
      fuel_consumed_liters: 125,
    }))
    toast.success("Trip completed")
    setIsLoading(false)
  }

  const handleCancel = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setTrip(prev => ({ ...prev, status: "Cancelled" }))
    toast.success("Trip cancelled")
    setShowCancelConfirm(false)
    setIsLoading(false)
  }

  return {
    trip,
    showCancelConfirm,
    setShowCancelConfirm,
    isLoading,
    handleDispatch,
    handleComplete,
    handleCancel,
    navigate,
  }
}
