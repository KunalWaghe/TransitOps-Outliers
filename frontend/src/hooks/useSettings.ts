import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { getSettings, updateSettings } from "@/api/settings"
import { useAuth } from "@/hooks/useAuth"

const currencyOptions = [
  { value: "INR", label: "INR (Rs)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
]

const distanceUnitOptions = [
  { value: "Kilometers", label: "Kilometers" },
  { value: "Miles", label: "Miles" },
]

export function useSettings() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isAdmin = user?.role === "fleet_manager"

  const [depotName, setDepotName] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [distanceUnit, setDistanceUnit] = useState("Kilometers")

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })

  useEffect(() => {
    if (!data) return
    setDepotName(data.depot_name ?? "")
    setCurrency(data.currency ?? "INR")
    setDistanceUnit(data.distance_unit ?? "Kilometers")
  }, [data])

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast.success("Settings saved successfully")
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } }
      if (axiosErr?.response?.status === 403) {
        toast.error("Only Fleet Managers can update settings.")
        return
      }
      toast.error(axiosErr?.response?.data?.detail ?? "Failed to save settings.")
    },
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin || mutation.isPending) return

    await mutation.mutateAsync({
      depot_name: depotName.trim() || null,
      currency,
      distance_unit: distanceUnit,
    })
  }

  return {
    depotName,
    setDepotName,
    currency,
    setCurrency,
    distanceUnit,
    setDistanceUnit,
    currencyOptions,
    distanceUnitOptions,
    isLoading,
    isSaving: mutation.isPending,
    isAdmin,
    handleSave,
  }
}
