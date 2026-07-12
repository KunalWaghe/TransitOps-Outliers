import { useMemo, useState } from "react"
import toast from "react-hot-toast"

export interface MaintenanceRecord {
  id: number
  date: string
  vehicle: string
  service_type: string
  cost: number
  status: "Active" | "Completed"
  notes?: string
}

export const mockRecords: MaintenanceRecord[] = [
  { id: 1, date: "2026-07-12", vehicle: "VAN-05", service_type: "Oil Change", cost: 2500, status: "Active" },
  { id: 2, date: "2026-07-11", vehicle: "TRUCK-11", service_type: "Engine Repair", cost: 18000, status: "Completed" },
  { id: 3, date: "2026-07-10", vehicle: "MINI-03", service_type: "Tyre Replace", cost: 6200, status: "Active" },
  { id: 4, date: "2026-07-08", vehicle: "VAN-02", service_type: "Routine Inspection", cost: 850, status: "Completed" },
]

export const vehicles = [
  { value: "", label: "Select vehicle" },
  { value: "VAN-05", label: "VAN-05" },
  { value: "TRUCK-11", label: "TRUCK-11" },
  { value: "MINI-03", label: "MINI-03" },
]

export const serviceTypes = [
  { value: "", label: "Select service" },
  { value: "Oil Change", label: "Oil Change" },
  { value: "Tyre Replace", label: "Tyre Replace" },
  { value: "Engine Repair", label: "Engine Repair" },
  { value: "Routine Inspection", label: "Routine Inspection" },
]

export function useMaintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockRecords)
  const [form, setForm] = useState({
    vehicle: "",
    service_type: "",
    cost: "",
    date: "",
    status: "Active",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.vehicle) newErrors.vehicle = "Select vehicle"
    if (!form.service_type) newErrors.service_type = "Select service type"
    if (!form.cost || Number(form.cost) <= 0) newErrors.cost = "Enter valid cost"
    if (!form.date) newErrors.date = "Select date"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const newRecord: MaintenanceRecord = {
      id: Date.now(),
      date: form.date,
      vehicle: form.vehicle,
      service_type: form.service_type,
      cost: Number(form.cost),
      status: form.status as "Active" | "Completed",
      notes: form.notes,
    }
    setRecords(prev => [newRecord, ...prev])
    setForm({ vehicle: "", service_type: "", cost: "", date: "", status: "Active", notes: "" })
    toast.success("Maintenance record saved")
    setIsSubmitting(false)
  }

  const handleClose = (id: number) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, status: "Completed" as const } : r)))
    toast.success("Record marked as completed")
  }

  const totalCost = useMemo(() => records.reduce((sum, r) => sum + r.cost, 0), [records])

  return {
    records,
    form,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    handleClose,
    totalCost,
  }
}
