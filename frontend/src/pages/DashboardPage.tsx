import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Route,
  Truck,
  Wrench,
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const utilizationData = [
  { hour: "00:00", value: 40 },
  { hour: "03:00", value: 55 },
  { hour: "06:00", value: 60 },
  { hour: "09:00", value: 45 },
  { hour: "12:00", value: 70 },
  { hour: "15:00", value: 85 },
  { hour: "18:00", value: 75 },
  { hour: "21:00", value: 80 },
  { hour: "23:00", value: 65 },
  { hour: "Now", value: 71 },
]

interface KpiCardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ReactNode
  status?: "good" | "warning" | "danger"
  showProgress?: boolean
  progress?: number
}

function KpiCard({ label, value, subValue, icon, status = "good", showProgress, progress }: KpiCardProps) {
  const statusDot = {
    good: "bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.4)]",
    warning: "bg-[#dd5b00] shadow-[0_0_8px_rgba(221,91,0,0.4)]",
    danger: "bg-[var(--destructive)] shadow-[0_0_8px_rgba(221,91,0,0.4)]",
  }

  return (
    <Card className="flex flex-col justify-between h-36 relative overflow-hidden group hover:border-[var(--brand-hairline)] transition-colors">
      <div className="flex items-center justify-between z-10">
        <span className="font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
          {label}
        </span>
        {status ? <div className={cn("w-1.5 h-1.5 rounded-full", statusDot[status])} /> : icon}
      </div>
      <div className="z-10 flex items-baseline gap-2 mt-auto">
        <span
          className={cn(
            "font-semibold text-[var(--brand-ink)] tracking-tight",
            status === "danger" && "text-[var(--destructive)]"
          )}
          style={{ fontSize: "var(--text-heading-1)", lineHeight: "var(--leading-heading-1)" }}
        >
          {value}
        </span>
        {subValue && (
          <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
            {subValue}
          </span>
        )}
      </div>
      {showProgress && progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-[var(--brand-canvas-soft)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--brand-primary)] h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--brand-primary)]/5 to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />
    </Card>
  )
}

interface TripRow {
  id: string
  vehicle: string
  driver: string
  driverInitials: string
  route: string
  status: string
  statusVariant: Parameters<typeof StatusBadge>[0]["variant"]
  eta: string
  etaHighlight?: string
}

const tripColumns: Column<TripRow>[] = [
  { key: "id", header: "Trip ID", render: row => <span className="font-mono text-[var(--brand-ink-muted)]">{row.id}</span> },
  { key: "vehicle", header: "Vehicle", render: row => <span className="font-medium">{row.vehicle}</span> },
  {
    key: "driver",
    header: "Driver",
    render: row => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[var(--brand-canvas-soft)] border border-[var(--brand-hairline)] flex items-center justify-center text-[10px] font-semibold text-[var(--brand-ink-muted)]">
          {row.driverInitials}
        </div>
        <span>{row.driver}</span>
      </div>
    ),
  },
  { key: "route", header: "Route", render: row => <span className="text-[var(--brand-ink-muted)]">{row.route}</span> },
  {
    key: "status",
    header: "Status",
    render: row => <StatusBadge status={row.status} variant={row.statusVariant} />,
  },
  { key: "eta", header: "ETA", align: "right", render: row => <span className="font-mono text-[var(--brand-ink-muted)]">{row.eta}</span> },
]

const trips: TripRow[] = [
  { id: "TR-8429", vehicle: "Bus-042", driver: "John Doe", driverInitials: "JD", route: "Downtown Express", status: "En Route", statusVariant: "active", eta: "14:30" },
  { id: "TR-8430", vehicle: "Van-11A", driver: "Alice Smith", driverInitials: "AS", route: "Northside Loop", status: "Delayed", statusVariant: "delayed", eta: "15:15", etaHighlight: "+15m" },
  { id: "TR-8431", vehicle: "Bus-019", driver: "Mike Ross", driverInitials: "MR", route: "Airport Shuttle", status: "Boarding", statusVariant: "dispatched", eta: "14:45" },
  { id: "TR-8425", vehicle: "Van-08B", driver: "Sarah Jones", driverInitials: "SJ", route: "South Park Run", status: "Completed", statusVariant: "completed", eta: "13:50" },
]

interface Alert {
  id: string
  type: "error" | "warning" | "info"
  message: string
  meta: string
}

const alerts: Alert[] = [
  { id: "1", type: "error", message: "Vehicle V-104 reported engine temperature anomaly.", meta: "Route 42 • 10 mins ago" },
  { id: "2", type: "warning", message: "Driver delay reported at Checkpoint Delta.", meta: "Trip TR-892 • 25 mins ago" },
  { id: "3", type: "info", message: "Routine maintenance schedule generated for Fleet B.", meta: "System • 1 hour ago" },
]

export function DashboardPage() {
  const [currentHour, setCurrentHour] = useState("12h")

  useEffect(() => {
    document.title = "TransitOps Dashboard"
  }, [])

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader
        title="Operational Overview"
        subtitle="Real-time status of fleet and dispatch operations."
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[var(--space-md)]">
        <KpiCard label="Active Vehicles" value="142" subValue="/ 200" icon={<Truck size={16} />} status="good" />
        <KpiCard label="Available" value="46" icon={<CheckCircle2 size={16} />} status="good" />
        <KpiCard label="In Maintenance" value="12" icon={<Wrench size={16} />} status="danger" />
        <KpiCard label="Active Trips" value="89" icon={<Route size={16} />} status="good" />
        <KpiCard label="Fleet Utilization" value="71%" icon={<BarChart3 size={16} />} status="good" showProgress progress={71} />
      </div>

      {/* Middle section: chart + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-md)]">
        <Card className="lg:col-span-2 flex flex-col h-96">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold text-[var(--brand-ink)]"
              style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
            >
              Utilization Trend
            </h2>
            <div className="flex gap-1 bg-[var(--background)] p-1 rounded-[var(--radius-md)] border border-[var(--border)]">
              {["24h", "7d", "30d"].map(hour => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => setCurrentHour(hour)}
                  className={cn(
                    "px-3 py-1 rounded-[var(--radius-sm)] font-medium transition-colors",
                    currentHour === hour
                      ? "bg-[var(--card)] text-[var(--brand-ink)] border border-[var(--border)] shadow-sm"
                      : "text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)]"
                  )}
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <XAxis dataKey="hour" tick={{ fill: "var(--brand-ink-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--brand-ink-muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--brand-ink)",
                  }}
                  cursor={{ fill: "var(--brand-canvas-soft)" }}
                />
                <Bar dataKey="value" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col h-96 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--destructive)]/5 blur-[50px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <h2
            className="font-semibold text-[var(--brand-ink)] mb-4 flex items-center gap-2"
            style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--destructive)]" />
            Priority Alerts
          </h2>
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="p-4 rounded-[var(--radius-md)] bg-[var(--background)] border border-[var(--border)] flex gap-3 items-start cursor-pointer group hover:border-[var(--brand-hairline)] transition-colors"
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                    alert.type === "error" && "bg-[var(--destructive)]",
                    alert.type === "warning" && "bg-[#dd5b00]",
                    alert.type === "info" && "bg-[var(--brand-ink-faint)]"
                  )}
                />
                <div>
                  <p
                    className="font-medium text-[var(--brand-ink)] leading-relaxed mb-1 group-hover:text-[var(--brand-primary)] transition-colors"
                    style={{ fontSize: "var(--text-body-sm)" }}
                  >
                    {alert.message}
                  </p>
                  <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                    {alert.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent trips table */}
      <Card>
        <div className="px-[var(--space-md)] py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2
            className="font-semibold text-[var(--brand-ink)]"
            style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
          >
            Active &amp; Recent Trips
          </h2>
          <button className="flex items-center gap-1 text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)] transition-colors font-medium" style={{ fontSize: "var(--text-caption)" }}>
            View All <ArrowUpRight size={14} />
          </button>
        </div>
        <DataTable columns={tripColumns} data={trips} keyExtractor={row => row.id} />
      </Card>
    </div>
  )
}
