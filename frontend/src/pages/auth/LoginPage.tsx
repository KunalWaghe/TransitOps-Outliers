import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/shared/Button"

const ROLES = [
  { id: "fleet_manager", label: "Fleet Manager" },
  { id: "dispatcher", label: "Dispatcher" },
  { id: "driver", label: "Driver" },
]

export function LoginPage() {
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

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[var(--background)] p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--brand-ink-muted) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1
            className="font-bold text-[var(--brand-ink)] mb-2"
            style={{
              fontSize: "var(--text-heading-1)",
              lineHeight: "var(--leading-heading-1)",
              letterSpacing: "var(--tracking-heading-1)",
            }}
          >
            TransitOps
          </h1>
          <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-body-md)" }}>
            Smart Transport Operations Platform
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 md:p-8 shadow-[var(--shadow-1)]">
          <h2
            className="font-semibold text-[var(--brand-ink)] mb-6 text-center"
            style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
          >
            Sign in to your account
          </h2>

          {/* Role tabs */}
          <div className="flex p-1 bg-[var(--background)] rounded-[var(--radius-md)] border border-[var(--border)] mb-6">
            {ROLES.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex-1 py-1.5 text-center font-medium transition-all rounded-[var(--radius-sm)]",
                  selectedRole === role.id
                    ? "bg-[var(--brand-surface)] text-[var(--brand-ink)] shadow-sm"
                    : "text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)]"
                )}
                style={{ fontSize: "var(--text-caption)" }}
              >
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3 text-[var(--brand-ink-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="manager@transitops.com"
                  className={cn(
                    "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)]",
                    "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                    "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]",
                    "pl-10 pr-3 py-2.5"
                  )}
                  style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
                  Password
                </label>
                <button
                  type="button"
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-active)] transition-colors"
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3 text-[var(--brand-ink-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)]",
                    "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                    "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]",
                    "pl-10 pr-10 py-2.5"
                  )}
                  style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[var(--brand-ink-muted)] hover:text-[var(--brand-ink)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center mt-2 mb-4">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--input)] bg-[var(--background)] text-[var(--primary)] focus:ring-[var(--ring)]"
              />
              <label htmlFor="remember-me" className="ml-2 text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-body-sm)" }}>
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <p className="text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-body-sm)" }}>
            Don&apos;t have an account?{" "}
            <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-active)] font-medium transition-colors">
              Request Access
            </button>
          </p>
          <p className="text-[var(--brand-ink-faint)]" style={{ fontSize: "var(--text-caption)" }}>
            © 2026 TransitOps Platform. RBAC Enabled.
          </p>
        </div>
      </div>
    </div>
  )
}
