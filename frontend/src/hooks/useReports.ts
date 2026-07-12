import { useState } from "react"
import toast from "react-hot-toast"
import { exportReportCsv, exportReportPdf } from "@/api/reports"
import { useAuth } from "@/hooks/useAuth"

export const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 14000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 20000 },
  { month: "Jun", revenue: 28000 },
  { month: "Jul", revenue: 26000 },
  { month: "Aug", revenue: 32000 },
]

export const topCostlyVehicles = [
  { name: "TRUCK-II", cost: 12450, color: "#dd5b00" },
  { name: "MINI-03", cost: 8200, color: "#2a9d99" },
  { name: "VAN-05", cost: 5100, color: "var(--brand-primary)" },
]

export const maxCost = topCostlyVehicles[0].cost

export type ExportFormat = "csv" | "pdf"

export function useReports() {
  const { user } = useAuth()
  const [year, setYear] = useState("2026")
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv")
  const [isExporting, setIsExporting] = useState(false)
  const financialAnalyst = user?.role === "financial_analyst"

  const handleExport = async () => {
    if (isExporting) return
    setIsExporting(true)
    const toastId = toast.loading(`Exporting ${exportFormat.toUpperCase()} report…`)
    try {
      if (exportFormat === "csv") {
        await exportReportCsv()
      } else {
        await exportReportPdf()
      }
      toast.success("Report downloaded successfully", { id: toastId })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: Blob } }
      if (axiosErr?.response?.status === 403) {
        toast.error("Access denied. Only Financial Analysts can export reports.", { id: toastId })
      } else if (axiosErr?.response?.data instanceof Blob) {
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

  return {
    year,
    setYear,
    exportFormat,
    setExportFormat,
    isExporting,
    financialAnalyst,
    handleExport,
  }
}
