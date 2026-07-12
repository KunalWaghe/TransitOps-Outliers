import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog, exportMaintenanceCsv } from "@/api/maintenance"
import { getVehicles } from "@/api/vehicles"
import type { MaintenanceCreate, MaintenanceResponse, MaintenanceType, MaintenanceStatus } from "@/api/types"

export interface MaintenanceRecord extends MaintenanceResponse {
  date: string
  vehicle: string
  service_type: string
}

export function useMaintenance() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    vehicle_id: "",
    type: "",
    cost: "",
    status: "Active",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isExporting, setIsExporting] = useState(false)

  const { data: rawLogs = [], isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => getMaintenanceLogs()
  })

  const { data: vehiclesData = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles()
  })

  const vehicles = useMemo(() => {
    return [
      { value: "", label: "Select vehicle" },
      ...vehiclesData.map(v => ({ value: String(v.id), label: v.registration_number }))
    ]
  }, [vehiclesData])

  const serviceTypes = [
    { value: "", label: "Select service" },
    { value: "Oil Change", label: "Oil Change" },
    { value: "Tire Replacement", label: "Tire Replacement" },
    { value: "Engine Repair", label: "Engine Repair" },
    { value: "Brake Service", label: "Brake Service" },
    { value: "General Inspection", label: "General Inspection" },
  ]

  const records: MaintenanceRecord[] = useMemo(() => {
    return rawLogs.map(log => ({
      ...log,
      date: new Date(log.created_at).toISOString().split("T")[0],
      vehicle: vehiclesData.find(v => v.id === log.vehicle_id)?.registration_number || `Vehicle ${log.vehicle_id}`,
      service_type: log.type,
    }))
  }, [rawLogs, vehiclesData])

  const createMutation = useMutation({
    mutationFn: (data: MaintenanceCreate) => createMaintenanceLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] })
      toast.success("Maintenance record saved")
      setForm({ vehicle_id: "", type: "", cost: "", status: "Active", notes: "" })
    },
    onError: () => toast.error("Failed to create maintenance record")
  })

  const closeMutation = useMutation({
    mutationFn: (id: number) => closeMaintenanceLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] })
      toast.success("Record marked as closed")
    },
    onError: () => toast.error("Failed to close record")
  })

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.vehicle_id) newErrors.vehicle_id = "Select vehicle"
    if (!form.type) newErrors.type = "Select service type"
    if (!form.cost || Number(form.cost) <= 0) newErrors.cost = "Enter valid cost"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createMutation.mutate({
      vehicle_id: Number(form.vehicle_id),
      type: form.type as MaintenanceType,
      cost: Number(form.cost),
      notes: form.notes || null,
      status: form.status as MaintenanceStatus
    })
  }

  const handleClose = (id: number) => {
    closeMutation.mutate(id)
  }

  const handleExport = async () => {
    if (isExporting) return

    setIsExporting(true)
    const toastId = toast.loading("Exporting maintenance log...")

    try {
      await exportMaintenanceCsv()
      toast.success("Maintenance log downloaded successfully", { id: toastId })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Blob } }
      if (axiosErr?.response?.data instanceof Blob) {
        const text = await axiosErr.response.data.text()
        try {
          const json = JSON.parse(text)
          toast.error(json.detail ?? "Export failed. Please try again.", { id: toastId })
        } catch {
          toast.error("Export failed. Please try again.", { id: toastId })
        }
      } else {
        toast.error("Export failed. Please try again.", { id: toastId })
      }
    } finally {
      setIsExporting(false)
    }
  }

  const totalCost = useMemo(() => records.reduce((sum, r) => sum + r.cost, 0), [records])

  return {
    records,
    form,
    errors,
    isSubmitting: createMutation.isPending,
    isLoading,
    isExporting,
    updateField,
    handleSubmit,
    handleClose,
    handleExport,
    totalCost,
    vehicles,
    serviceTypes,
  }
}
