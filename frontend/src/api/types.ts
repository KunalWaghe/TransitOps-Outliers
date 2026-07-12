export type VehicleStatus = "Available" | "In Shop" | "On Trip"
export type VehicleType = "Truck" | "Van"

export interface VehicleCreate {
  registration_number: string
  name: string
  type: VehicleType
  max_capacity_kg: number
  odometer_km: number
  acquisition_cost: number
  region: string
  status?: VehicleStatus | null
}

export interface VehicleResponse extends VehicleCreate {
  id: number
  created_at: string
  updated_at: string
}

export interface VehicleUpdate {
  name?: string | null
  type?: VehicleType | null
  max_capacity_kg?: number | null
  odometer_km?: number | null
  acquisition_cost?: number | null
  region?: string | null
  status?: VehicleStatus | null
}

export type LicenseCategory = "A" | "B" | "C" | "D" | "E"
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended"

export interface DriverCreate {
  name: string
  license_number: string
  license_category: LicenseCategory
  license_expiry: string
  contact_number: string
  safety_score: number
  status?: DriverStatus | null
}

export interface DriverResponse extends DriverCreate {
  id: number
  created_at: string
  updated_at: string
}

export interface DriverUpdate {
  name?: string | null
  license_category?: LicenseCategory | null
  license_expiry?: string | null
  contact_number?: string | null
  safety_score?: number | null
  status?: DriverStatus | null
}

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled"

export interface TripCreate {
  source: string
  destination: string
  vehicle_id: number
  driver_id: number
  cargo_weight_kg: number
  planned_distance_km: number
  revenue?: number | null
  status?: TripStatus | null
}

export interface TripResponse extends TripCreate {
  id: number
  actual_distance_km?: number | null
  fuel_consumed_liters?: number | null
  created_at: string
  dispatched_at?: string | null
  completed_at?: string | null
}

export interface TripComplete {
  actual_distance_km: number
  fuel_consumed_liters: number
}

export type MaintenanceType = "Oil Change" | "Tire Replacement" | "Engine Repair" | "Brake Service" | "General Inspection"
export type MaintenanceStatus = "Active" | "Closed"

export interface MaintenanceCreate {
  vehicle_id: number
  type: MaintenanceType
  cost: number
  notes?: string | null
  status?: MaintenanceStatus | null
}

export interface MaintenanceResponse extends MaintenanceCreate {
  id: number
  created_at: string
  closed_at?: string | null
}

export interface FuelLogCreate {
  vehicle_id: number
  liters: number
  cost: number
  odometer_km: number
}

export interface FuelLogResponse extends FuelLogCreate {
  id: number
  date: string
  created_at: string
}

export interface ExpenseCreate {
  vehicle_id: number
  category: string
  amount: number
  description?: string | null
}

export interface ExpenseResponse extends ExpenseCreate {
  id: number
  date: string
  created_at: string
}

export interface HTTPValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}
