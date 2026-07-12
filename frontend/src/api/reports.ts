import { apiClient } from "./client"

type ExportFormat = "csv" | "pdf"

async function downloadBlob(format: ExportFormat): Promise<void> {
  const response = await apiClient.get(`/api/reports/export/${format}`, {
    responseType: "blob",
  })

  const mimeType = format === "csv" ? "text/csv" : "application/pdf"
  const blob = new Blob([response.data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `trips_report.${format}`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url)
}

export async function exportReportCsv(): Promise<void> {
  return downloadBlob("csv")
}

export async function exportReportPdf(): Promise<void> {
  return downloadBlob("pdf")
}
