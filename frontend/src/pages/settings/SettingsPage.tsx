import { Lock, Bell, LogOut, Shield, ChevronRight, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shared/Button"

interface SettingsSectionProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function SettingsSection({ icon, label, active, onClick }: SettingsSectionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] transition-all",
        "text-left group",
        active
          ? "bg-[var(--brand-canvas-soft)] border-l-2 border-[var(--brand-primary)]"
          : "hover:bg-[var(--brand-canvas-soft)]"
      )}
    >
      <span className={cn(
        "shrink-0",
        active ? "text-[var(--brand-primary)]" : "text-[var(--brand-ink-muted)] group-hover:text-[var(--brand-ink)]"
      )}>
        {icon}
      </span>
      <span
        className="flex-1 text-[var(--brand-ink)]"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: "var(--leading-body)",
        }}
      >
        {label}
      </span>
      {!active && (
        <ChevronRight size={16} className="text-[var(--brand-ink-muted)]" />
      )}
    </button>
  )
}

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("security")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password update
    console.log("Update password")
  }

  return (
    <div className="space-y-[var(--space-lg)]">
      {/* Page Header */}
      <div>
        <h1
          className="font-bold text-[var(--brand-ink)]"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-title)",
            letterSpacing: "var(--tracking-title)",
          }}
        >
          Settings
        </h1>
        <p
          className="text-[var(--brand-ink-muted)] mt-1"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
          }}
        >
          Manage your account preferences and security.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Menu */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Actions */}
          <div className="bg-[var(--brand-surface)] border border-[var(--brand-hairline)] rounded-[var(--radius-lg)] p-4 space-y-2">
            <SettingsSection
              icon={<User size={20} />}
              label="Personal Details"
              active={activeSection === "personal"}
              onClick={() => setActiveSection("personal")}
            />
            <SettingsSection
              icon={<Lock size={20} />}
              label="Security & Password"
              active={activeSection === "security"}
              onClick={() => setActiveSection("security")}
            />
            <SettingsSection
              icon={<Bell size={20} />}
              label="Notifications"
              active={activeSection === "notifications"}
              onClick={() => setActiveSection("notifications")}
            />
            
            <div className="h-px bg-[var(--brand-hairline)] my-2" />
            
            <button
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)]",
                "text-left group transition-all",
                "hover:bg-red-500/10 text-red-400 hover:text-red-300"
              )}
            >
              <LogOut size={20} className="shrink-0" />
              <span
                className="font-medium"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                }}
              >
                Sign Out
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Password Form */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--brand-surface)] border border-[var(--brand-hairline)] rounded-[var(--radius-lg)]">
            <div className="p-6 border-b border-[var(--brand-hairline)]">
              <h3
                className="font-semibold text-[var(--brand-ink)]"
                style={{
                  fontSize: "var(--text-subheading)",
                  lineHeight: "var(--leading-subheading)",
                }}
              >
                Change Password
              </h3>
              <p
                className="text-[var(--brand-ink-muted)] mt-1"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                }}
              >
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-6">
              <div className="space-y-4 max-w-md">
                {/* Old Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="old-password"
                    className="text-[var(--brand-ink)] font-medium"
                    style={{
                      fontSize: "var(--text-caption)",
                      lineHeight: "var(--leading-caption)",
                    }}
                  >
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full px-3 py-2.5 rounded-[var(--radius-md)]",
                      "bg-[var(--background)] border border-[var(--input)]",
                      "text-[var(--brand-ink)]",
                      "focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    )}
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                    }}
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="new-password"
                    className="text-[var(--brand-ink)] font-medium"
                    style={{
                      fontSize: "var(--text-caption)",
                      lineHeight: "var(--leading-caption)",
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full px-3 py-2.5 rounded-[var(--radius-md)]",
                      "bg-[var(--background)] border border-[var(--input)]",
                      "text-[var(--brand-ink)]",
                      "focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    )}
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                    }}
                  />
                  <p
                    className="text-[var(--brand-ink-muted)]"
                    style={{
                      fontSize: "var(--text-caption)",
                      lineHeight: "var(--leading-caption)",
                    }}
                  >
                    Minimum 8 characters, at least one uppercase letter and one number.
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="text-[var(--brand-ink)] font-medium"
                    style={{
                      fontSize: "var(--text-caption)",
                      lineHeight: "var(--leading-caption)",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full px-3 py-2.5 rounded-[var(--radius-md)]",
                      "bg-[var(--background)] border border-[var(--input)]",
                      "text-[var(--brand-ink)]",
                      "focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    )}
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                    }}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-dashed border-[var(--brand-hairline)]">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="mt-6 bg-[var(--brand-surface)] border border-[var(--brand-hairline)] rounded-[var(--radius-lg)] p-5 flex items-start gap-4">
            <Shield size={20} className="text-[var(--brand-ink-muted)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4
                className="font-medium text-[var(--brand-ink)]"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                }}
              >
                Two-Factor Authentication
              </h4>
              <p
                className="text-[var(--brand-ink-muted)] mt-1 mb-3"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                }}
              >
                Add an extra layer of security to your account.
              </p>
              <Button variant="secondary" size="sm">
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
