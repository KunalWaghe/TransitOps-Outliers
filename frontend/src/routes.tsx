import { createBrowserRouter } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { DashboardPage } from "@/pages/DashboardPage"
import { DesignSystemPage } from "@/pages/DesignSystemPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    path: "/designsystem",
    element: <DesignSystemPage />,
    handle: { crumb: "Design System" },
  },
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: { crumb: "Dashboard" },
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
