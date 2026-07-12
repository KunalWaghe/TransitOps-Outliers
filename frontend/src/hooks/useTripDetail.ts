import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getTrip, dispatchTrip, completeTrip, cancelTrip } from "@/api/trips"
import { getVehicles } from "@/api/vehicles"
import { getDrivers } from "@/api/drivers"
import type { TripResponse, TripComplete } from "@/api/types"

export interface Trip extends TripResponse {
  trip_id: string
  vehicle: string
  driver: string
}

export function useTripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: rawTrip, isLoading: isLoadingTrip } = useQuery({
    queryKey: ["trips", id],
    queryFn: () => getTrip(Number(id)),
    enabled: Boolean(id)
  })

  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: () => getVehicles() })
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: () => getDrivers() })

  const trip: Trip | null = rawTrip ? {
    ...rawTrip,
    trip_id: `TR-${rawTrip.id}`,
    vehicle: vehicles.find(v => v.id === rawTrip.vehicle_id)?.registration_number || `Vehicle ${rawTrip.vehicle_id}`,
    driver: drivers.find(d => d.id === rawTrip.driver_id)?.name || `Driver ${rawTrip.driver_id}`,
  } : null

  const dispatchMutation = useMutation({
    mutationFn: () => dispatchTrip(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", id] })
      toast.success("Trip dispatched")
    },
    onError: () => toast.error("Failed to dispatch trip")
  })

  const completeMutation = useMutation({
    mutationFn: (data: TripComplete) => completeTrip(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", id] })
      toast.success("Trip completed")
    },
    onError: () => toast.error("Failed to complete trip")
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelTrip(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", id] })
      toast.success("Trip cancelled")
      setShowCancelConfirm(false)
    },
    onError: () => toast.error("Failed to cancel trip")
  })

  const handleDispatch = async () => {
    dispatchMutation.mutate()
  }

  const handleComplete = async () => {
    completeMutation.mutate({
      actual_distance_km: trip?.planned_distance_km || 0,
      fuel_consumed_liters: 0, // In a full app, this would be collected via a form
    })
  }

  const handleCancel = async () => {
    cancelMutation.mutate()
  }

  const isMutating = dispatchMutation.isPending || completeMutation.isPending || cancelMutation.isPending

  return {
    trip,
    showCancelConfirm,
    setShowCancelConfirm,
    isLoading: isLoadingTrip || isMutating,
    handleDispatch,
    handleComplete,
    handleCancel,
    navigate,
  }
}
