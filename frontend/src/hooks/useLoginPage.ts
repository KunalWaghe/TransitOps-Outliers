import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"

export function useLoginPage() {
  const [email, setEmail] = useState("admin@transitops.com")
  const [password, setPassword] = useState("password123")
  const [selectedRole, setSelectedRole] = useState("fleet_manager")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      toast.success("Welcome back")
    } catch {
      toast.error("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    selectedRole,
    setSelectedRole,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    handleSubmit,
  }
}
