import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthProvider"
import { router } from "./routes"

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
