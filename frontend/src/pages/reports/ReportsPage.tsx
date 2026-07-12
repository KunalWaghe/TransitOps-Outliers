import { Download, Fuel, PieChart, TrendingUp, Wallet } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { PageHeader } from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils"
import {
  useReports,
  revenueData,
  topCostlyVehicles,
  maxCost,
} from "@/hooks/useReports"

interface KpiCardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ReactNode
  trend?: { direction: "up" | "down"; value: string }
}

function KpiCard({ label, value, subValue, icon, trend }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-[var(--brand-hairline)] transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <p className="text-[var(--brand-ink-muted)] uppercase tracking-wider mb-2" style={{ fontSize: "var(--text-caption)" }}>
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        {subValue && <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-title)" }}>{subValue}</span>}
        <h3 className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-heading-1)", lineHeight: "var(--leading-heading-1)" }}>
          {value}
        </h3>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "flex items-center text-[11px] font-medium px-2 py-0.5 rounded",
              trend.direction === "up" ? "bg-[#102b1c]/10 text-[#4ade80]" : "bg-[var(--destructive)]/10 text-[var(--destructive)]"
            )}
          >
            <TrendingUp size={14} className="mr-1" />
            {trend.value}
          </span>
          <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>vs last month</span>
        </div>
      )}
    </Card>
  )
}

export function ReportsPage() {
  const { year, setYear, financialAnalyst, handleExport } = useReports()

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader title="Reports & Analytics" subtitle="Operational performance and financial metrics.">
        {financialAnalyst && (
          <Button variant="secondary" leftIcon={<Download size={18} />} onClick={handleExport}>
            Export Report
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]">
        <KpiCard
          label="Fuel Efficiency"
          value="8.4"
          subValue="km/l"
          icon={<Fuel size={40} />}
          trend={{ direction: "up", value: "+2.1%" }}
        />
        <KpiCard
          label="Fleet Utilization"
          value="81%"
          icon={<PieChart size={40} />}
        />
        <KpiCard
          label="Operational Cost"
          value="34,070"
          subValue="₹"
          icon={<Wallet size={40} />}
          trend={{ direction: "down", value: "-4.5%" }}
        />
        <KpiCard
          label="Vehicle ROI"
          value="14.2%"
          icon={<TrendingUp size={40} />}
          trend={{ direction: "up", value: "+0.8%" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-md)]">
        <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                Monthly Revenue
              </h3>
              <p className="text-[var(--brand-ink-muted)] mt-1" style={{ fontSize: "var(--text-caption)" }}>
                ROI = Revenue - Maintenance - Fuel / Acquisition Cost
              </p>
            </div>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className={cn(
                "bg-[var(--background)] border border-[var(--input)] text-[var(--brand-ink)] rounded-[var(--radius-md)] px-3 py-1.5",
                "focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              )}
              style={{ fontSize: "var(--text-caption)" }}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--brand-ink-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--brand-ink-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={value => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--brand-ink)",
                  }}
                  cursor={{ fill: "var(--brand-canvas-soft)" }}
                  formatter={value => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="font-semibold text-[var(--brand-ink)] mb-6" style={{ fontSize: "var(--text-title)" }}>
            Top Costliest Vehicles
          </h3>
          <div className="space-y-6 flex-1">
            {topCostlyVehicles.map(vehicle => (
              <div key={vehicle.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-[var(--brand-ink)]" style={{ fontSize: "var(--text-caption)" }}>
                    {vehicle.name}
                  </span>
                  <span className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                    ₹{vehicle.cost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${Math.max((vehicle.cost / maxCost) * 100, 5)}%`, backgroundColor: vehicle.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
