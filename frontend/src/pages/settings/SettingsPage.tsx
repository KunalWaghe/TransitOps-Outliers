import { Check } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { Input } from "@/components/shared/Input"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select } from "@/components/shared/Select"
import { useSettings } from "@/hooks/useSettings"
import { cn } from "@/lib/utils"

type AccessLevel = "full" | "view" | "none"

interface RbacRow {
  role: string
  fleet: AccessLevel
  driver: AccessLevel
  trip: AccessLevel
  fuelExp: AccessLevel
  analytics: AccessLevel
}

const rbacMatrix: RbacRow[] = [
  {
    role: "Fleet Manager",
    fleet: "full",
    driver: "full",
    trip: "none",
    fuelExp: "none",
    analytics: "full",
  },
  {
    role: "Dispatcher",
    fleet: "view",
    driver: "none",
    trip: "full",
    fuelExp: "none",
    analytics: "none",
  },
  {
    role: "Safety Officer",
    fleet: "none",
    driver: "full",
    trip: "view",
    fuelExp: "none",
    analytics: "none",
  },
  {
    role: "Financial Analyst",
    fleet: "view",
    driver: "none",
    trip: "none",
    fuelExp: "full",
    analytics: "full",
  },
]

const rbacColumns: { key: keyof Omit<RbacRow, "role">; label: string }[] = [
  { key: "fleet", label: "Fleet" },
  { key: "driver", label: "Driver" },
  { key: "trip", label: "Trip" },
  { key: "fuelExp", label: "Fuel/Exp." },
  { key: "analytics", label: "Analytics" },
]

function AccessCell({ level }: { level: AccessLevel }) {
  if (level === "full") {
    return (
      <span className="inline-flex items-center justify-center text-[var(--brand-primary)]">
        <Check size={18} aria-hidden="true" />
        <span className="sr-only">Full access</span>
      </span>
    )
  }

  if (level === "view") {
    return (
      <span
        className="text-[var(--brand-ink-muted)] italic"
        style={{ fontSize: "var(--text-caption)" }}
      >
        view
      </span>
    )
  }

  return <span className="text-[var(--brand-ink-faint)]">—</span>
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-semibold text-[var(--brand-ink-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2"
      style={{ fontSize: "var(--text-eyebrow)", lineHeight: "var(--leading-eyebrow)" }}
    >
      {children}
    </h3>
  )
}

export function SettingsPage() {
  const {
    depotName,
    setDepotName,
    currency,
    setCurrency,
    distanceUnit,
    setDistanceUnit,
    currencyOptions,
    distanceUnitOptions,
    isLoading,
    isSaving,
    isAdmin,
    handleSave,
  } = useSettings()

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader
        title="Settings & RBAC"
        subtitle="Manage platform configurations and access control."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-xl)]">
        <section className="lg:col-span-4 space-y-[var(--space-md)]">
          <SectionHeading>General</SectionHeading>

          {isLoading ? (
            <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-body-sm)" }}>
              Loading settings…
            </p>
          ) : (
            <form onSubmit={handleSave} className="space-y-[var(--space-md)]">
              <Input
                label="Depot Name"
                id="depot-name"
                value={depotName}
                onChange={e => setDepotName(e.target.value)}
                disabled={!isAdmin}
              />

              <Select
                label="Currency"
                id="currency"
                options={currencyOptions}
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                disabled={!isAdmin}
              />

              <Select
                label="Distance Unit"
                id="distance-unit"
                options={distanceUnitOptions}
                value={distanceUnit}
                onChange={e => setDistanceUnit(e.target.value)}
                disabled={!isAdmin}
              />

              {!isAdmin && (
                <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                  Only Fleet Managers can edit general settings.
                </p>
              )}

              <div className="pt-[var(--space-xs)]">
                <Button type="submit" isLoading={isSaving} disabled={!isAdmin}>
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </section>

        <section className="lg:col-span-8">
          <SectionHeading>Role-Based Access (RBAC)</SectionHeading>

          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-[var(--brand-ink-muted)] uppercase tracking-wide"
                    style={{ fontSize: "var(--text-eyebrow)", lineHeight: "var(--leading-eyebrow)" }}
                  >
                    <th className="py-3 px-4 font-medium">Role</th>
                    {rbacColumns.map(col => (
                      <th key={col.key} className="py-3 px-4 font-medium text-center">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-[var(--border)]"
                  style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
                >
                  {rbacMatrix.map(row => (
                    <tr
                      key={row.role}
                      className={cn(
                        "transition-colors hover:bg-[var(--brand-canvas-soft)]/50"
                      )}
                    >
                      <td className="py-3 px-4 font-medium text-[var(--brand-ink)]">{row.role}</td>
                      {rbacColumns.map(col => (
                        <td key={col.key} className="py-3 px-4 text-center">
                          <AccessCell level={row[col.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
