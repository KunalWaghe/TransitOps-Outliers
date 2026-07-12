import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft, CheckCircle2, MapPin, Route, Send, Truck, User, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"
import { useTripDetail } from "@/hooks/useTripDetail"

export function TripDetailPage() {
  const navigate = useNavigate()
  const {
    trip,
    showCancelConfirm,
    setShowCancelConfirm,
    isLoading,
    handleDispatch,
    handleComplete,
    handleCancel,
  } = useTripDetail()

  const statusVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
    Draft: "draft",
    Dispatched: "dispatched",
    Completed: "completed",
    Cancelled: "cancelled",
  }

  if (isLoading && !trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--brand-primary)]" size={32} />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-[var(--brand-ink-muted)]">Trip not found.</p>
        <Button onClick={() => navigate("/trips")}>Back to Trips</Button>
      </div>
    )
  }

  return (
    <div className="space-y-[var(--space-lg)]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/trips")}
          className="text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader title={`Trip ${trip.trip_id}`} subtitle="View trip details and manage lifecycle." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-lg)]">
        <div className="lg:col-span-2 space-y-[var(--space-md)]">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-title)" }}>
                Trip Status
              </h3>
              <StatusBadge status={trip.status} variant={statusVariantMap[trip.status] ?? "neutral"} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
              <InfoRow icon={<MapPin size={16} />} label="Source" value={trip.source} />
              <InfoRow icon={<MapPin size={16} />} label="Destination" value={trip.destination} />
              <InfoRow icon={<Truck size={16} />} label="Vehicle" value={trip.vehicle} />
              <InfoRow icon={<User size={16} />} label="Driver" value={trip.driver} />
              <InfoRow icon={<Route size={16} />} label="Planned Distance" value={`${trip.planned_distance_km} km`} />
              <InfoRow icon={<Route size={16} />} label="Cargo Weight" value={`${trip.cargo_weight_kg.toLocaleString("en-IN")} kg`} />
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4" style={{ fontSize: "var(--text-title)" }}>
              Timeline
            </h3>
            <div className="space-y-4">
              <TimelineItem label="Created" timestamp={trip.created_at} completed />
              <TimelineItem label="Dispatched" timestamp={trip.dispatched_at} completed={trip.status === "Dispatched" || trip.status === "Completed"} />
              <TimelineItem label="Completed" timestamp={trip.completed_at} completed={trip.status === "Completed"} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <h3 className="font-semibold text-[var(--brand-ink)] mb-4" style={{ fontSize: "var(--text-title)" }}>
              Actions
            </h3>
            <div className="space-y-3">
              {trip.status === "Draft" && (
                <Button onClick={handleDispatch} isLoading={isLoading} leftIcon={<Send size={18} />} className="w-full">
                  Dispatch Trip
                </Button>
              )}
              {trip.status === "Dispatched" && (
                <Button onClick={handleComplete} isLoading={isLoading} leftIcon={<CheckCircle2 size={18} />} className="w-full">
                  Complete Trip
                </Button>
              )}
              {(trip.status === "Draft" || trip.status === "Dispatched") && (
                <Button variant="danger" onClick={() => setShowCancelConfirm(true)} leftIcon={<XCircle size={18} />} className="w-full">
                  Cancel Trip
                </Button>
              )}
              {trip.status === "Completed" && (
                <div className="p-4 rounded-[var(--radius-md)] bg-[#102b1c]/10 border border-[#1b432a]/20 text-[#4ade80] text-center" style={{ fontSize: "var(--text-body-sm)" }}>
                  <CheckCircle2 size={18} className="mx-auto mb-2" />
                  Trip completed successfully
                </div>
              )}
              {trip.status === "Cancelled" && (
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 text-[var(--destructive)] text-center" style={{ fontSize: "var(--text-body-sm)" }}>
                  <XCircle size={18} className="mx-auto mb-2" />
                  Trip cancelled
                </div>
              )}
            </div>

            {trip.revenue && (
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <p className="text-[var(--brand-ink-muted)] mb-1" style={{ fontSize: "var(--text-caption)" }}>Revenue</p>
                <p className="font-semibold text-[var(--brand-ink)]" style={{ fontSize: "var(--text-heading-2)" }}>
                  ₹{trip.revenue.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center gap-3 text-[var(--destructive)] mb-4">
              <AlertTriangle size={24} />
              <h3 className="font-semibold" style={{ fontSize: "var(--text-title)" }}>Cancel Trip?</h3>
            </div>
            <p className="text-[var(--brand-ink-muted)] mb-6" style={{ fontSize: "var(--text-body-sm)" }}>
              This action cannot be undone. The trip will be marked as cancelled.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)}>
                Keep Trip
              </Button>
              <Button variant="danger" onClick={handleCancel} isLoading={isLoading}>
                Cancel Trip
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[var(--brand-ink-muted)] mt-0.5">{icon}</span>
      <div>
        <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>{label}</p>
        <p className="font-medium text-[var(--brand-ink)]" style={{ fontSize: "var(--text-body-sm)" }}>{value}</p>
      </div>
    </div>
  )
}

function TimelineItem({ label, timestamp, completed }: { label: string; timestamp?: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-2 h-2 rounded-full", completed ? "bg-[#4ade80]" : "bg-[var(--border)]")} />
      <div className="flex-1">
        <p className="font-medium text-[var(--brand-ink)]" style={{ fontSize: "var(--text-body-sm)" }}>{label}</p>
        {timestamp && (
          <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
            {new Date(timestamp).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  )
}
