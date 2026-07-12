import type { NavGroup } from "./types"

export const SIDEBAR_WIDTH_EXPANDED = 240
export const SIDEBAR_WIDTH_COLLAPSED = 64
export const SIDEBAR_STORAGE_KEY = "transitops-sidebar"
export const MOBILE_BREAKPOINT = 768

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "main",
    items: [
      { id: "dashboard",   label: "Dashboard",   icon: "LayoutDashboard", to: "/" },
      { id: "vehicles",    label: "Vehicles",    icon: "Truck",           to: "/vehicles" },
      { id: "drivers",     label: "Drivers",     icon: "Users",           to: "/drivers" },
      { id: "trips",       label: "Trips",       icon: "Route",           to: "/trips" },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { id: "maintenance", label: "Maintenance", icon: "Wrench",          to: "/maintenance" },
      { id: "fuel",        label: "Fuel Logs",   icon: "Fuel",            to: "/fuel" },
      { id: "expenses",    label: "Expenses",    icon: "Receipt",         to: "/expenses" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    items: [
      { id: "reports",     label: "Reports",     icon: "BarChart2",       to: "/reports" },
    ],
  },
  {
    id: "dev",
    label: "Development",
    items: [
      { id: "designsystem", label: "Design System", icon: "Palette", to: "/designsystem" },
    ],
  },
]
