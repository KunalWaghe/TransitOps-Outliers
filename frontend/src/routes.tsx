import { createBrowserRouter } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { RootLayout } from "@/components/RootLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LoginPage } from "@/pages/auth/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { VehicleFormPage } from "@/pages/vehicles/VehicleFormPage"
import { VehiclesListPage } from "@/pages/vehicles/VehiclesListPage"
import { DriverFormPage } from "@/pages/drivers/DriverFormPage"
import { DriversListPage } from "@/pages/drivers/DriversListPage"
import { FuelPage } from "@/pages/fuel/FuelPage"
import { ExpensesPage } from "@/pages/expenses/ExpensesPage"
import { MaintenancePage } from "@/pages/maintenance/MaintenancePage"
import { ReportsPage } from "@/pages/reports/ReportsPage"
import { SettingsPage } from "@/pages/settings/SettingsPage"
import { UserManagementPage } from "@/pages/users/UserManagementPage"
import { TripCreatePage } from "@/pages/trips/TripCreatePage"
import { TripDetailPage } from "@/pages/trips/TripDetailPage"
import { TripsListPage } from "@/pages/trips/TripsListPage"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: (
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
            handle: { crumb: "Dashboard" },
          },
          {
            path: "vehicles",
            handle: { crumb: "Vehicles" },
            children: [
              { index: true, element: <VehiclesListPage /> },
              { path: "new", element: <VehicleFormPage />, handle: { crumb: "Add Vehicle" } },
              { path: ":id/edit", element: <VehicleFormPage />, handle: { crumb: "Edit Vehicle" } },
            ],
          },
          {
            path: "drivers",
            handle: { crumb: "Drivers" },
            children: [
              { index: true, element: <DriversListPage /> },
              { path: "new", element: <DriverFormPage />, handle: { crumb: "Add Driver" } },
              { path: ":id/edit", element: <DriverFormPage />, handle: { crumb: "Edit Driver" } },
            ],
          },
          {
            path: "trips",
            handle: { crumb: "Trips" },
            children: [
              { index: true, element: <TripsListPage /> },
              { path: "new", element: <TripCreatePage />, handle: { crumb: "Create Trip" } },
              { path: ":id", element: <TripDetailPage />, handle: { crumb: "Trip Details" } },
            ],
          },
          {
            path: "maintenance",
            element: <MaintenancePage />,
            handle: { crumb: "Maintenance" },
          },
          {
            path: "fuel",
            element: <FuelPage />,
            handle: { crumb: "Fuel Logs" },
          },
          {
            path: "expenses",
            element: <ExpensesPage />,
            handle: { crumb: "Expenses" },
          },
          {
            path: "reports",
            element: <ReportsPage />,
            handle: { crumb: "Reports" },
          },
          {
            path: "settings",
            element: <SettingsPage />,
            handle: { crumb: "Settings" },
          },
          {
            path: "users",
            element: <UserManagementPage />,
            handle: { crumb: "User Management" },
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
