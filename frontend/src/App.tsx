import { Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { DashboardPage } from "@/pages/DashboardPage"
import { DesignSystemPage } from "@/pages/DesignSystemPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export default function App() {
  return (
    <Routes>
      <Route path="/designsystem" element={<DesignSystemPage />} />
      <Route element={<AppShell />}>
        <Route
          index
          element={<DashboardPage />}
          handle={{ crumb: "Dashboard" }}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
