import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, ShieldAlert, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/shared/Button"
import { Card } from "@/components/shared/Card"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { Modal } from "@/components/shared/Modal"
import { PageHeader } from "@/components/shared/PageHeader"
import { Input } from "@/components/shared/Input"
import { Select } from "@/components/shared/Select"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { cn } from "@/lib/utils"

const roleBadgeVariantMap: Record<string, Parameters<typeof StatusBadge>[0]["variant"]> = {
  fleet_manager: "success",
  dispatcher: "in_use",
  safety_officer: "available",
  financial_analyst: "dispatched",
}

const roleLabelMap: Record<string, string> = {
  fleet_manager: "Fleet Manager",
  dispatcher: "Dispatcher",
  safety_officer: "Safety Officer",
  financial_analyst: "Financial Analyst",
}

const roleOptions = [
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "safety_officer", label: "Safety Officer" },
  { value: "financial_analyst", label: "Financial Analyst" },
]

export function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    editingUser,
    openEditModal,
    closeEditModal,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUsers()

  // Form states - Create
  const [createName, setCreateName] = useState("")
  const [createEmail, setCreateEmail] = useState("")
  const [createPassword, setCreatePassword] = useState("")
  const [createRole, setCreateRole] = useState("dispatcher")
  const [createError, setCreateError] = useState("")

  // Form states - Edit
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("dispatcher")
  const [editError, setEditError] = useState("")

  // Sync editing user data to edit form states
  useEffect(() => {
    if (editingUser) {
      setEditName(editingUser.name)
      setEditEmail(editingUser.email)
      setEditRole(editingUser.role)
      setEditError("")
    }
  }, [editingUser])

  // Reset create form states
  useEffect(() => {
    if (!isCreateOpen) {
      setCreateName("")
      setCreateEmail("")
      setCreatePassword("")
      setCreateRole("dispatcher")
      setCreateError("")
    }
  }, [isCreateOpen])

  // Guard: Admin (fleet_manager) access only
  if (currentUser?.role !== "fleet_manager") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-[var(--destructive)]/10 flex items-center justify-center text-[var(--destructive)] mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-[var(--brand-ink)] mb-2">Access Denied</h2>
        <p className="text-[var(--brand-ink-muted)] max-w-md mb-6" style={{ fontSize: "var(--text-body-sm)" }}>
          Administrative privileges are required to access User Management. Please contact your system administrator if you believe this is an error.
        </p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const columns: Column<(typeof users)[0]>[] = [
    {
      key: "name",
      header: "Name",
      render: u => <span className="font-medium text-[var(--brand-ink)]">{u.name}</span>,
    },
    {
      key: "email",
      header: "Email Address",
      render: u => <span className="text-[var(--brand-ink-muted)] font-mono">{u.email}</span>,
    },
    {
      key: "role",
      header: "System Role",
      render: u => (
        <StatusBadge
          status={roleLabelMap[u.role] ?? u.role}
          variant={roleBadgeVariantMap[u.role] ?? "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      sortable: false,
      render: u => {
        const isSelf = u.id === currentUser?.id
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => openEditModal(u)}
              className="p-1 text-[var(--brand-ink-muted)] hover:text-[var(--brand-primary)] transition-colors"
              title="Edit User"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDeleteUser(u.id)}
              disabled={isSelf}
              className={cn(
                "p-1 text-[var(--brand-ink-muted)] transition-colors",
                isSelf ? "opacity-30 cursor-not-allowed" : "hover:text-[var(--destructive)]"
              )}
              title={isSelf ? "You cannot delete yourself" : "Delete User"}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      },
    },
  ]

  const onSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError("")

    if (!createName.trim()) {
      setCreateError("Name is required")
      return
    }
    if (!createEmail.trim()) {
      setCreateError("Email is required")
      return
    }
    if (!createPassword || createPassword.length < 6) {
      setCreateError("Password must be at least 6 characters")
      return
    }

    await handleCreateUser({
      name: createName,
      email: createEmail,
      password: createPassword,
      role: createRole,
    })
  }

  const onSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")

    if (!editName.trim()) {
      setEditError("Name is required")
      return
    }
    if (!editEmail.trim()) {
      setEditError("Email is required")
      return
    }

    if (editingUser) {
      await handleUpdateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        role: editRole,
      })
    }
  }

  return (
    <div className="space-y-[var(--space-lg)]">
      <PageHeader
        title="User Management"
        subtitle="Manage team members, system access credentials, and role-based permissions."
      >
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsCreateOpen(true)}>
          Add User
        </Button>
      </PageHeader>

      <Card>
        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-[var(--space-sm)] mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-ink-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className={cn(
                "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)] pl-10 pr-3 py-2",
                "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
                "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]"
              )}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
          </div>
        </div>

        {/* User Table */}
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={u => u.id}
          emptyMessage="No users matching the filters found"
          isLoading={isLoading}
          pageSize={10}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New User"
      >
        <form onSubmit={onSubmitCreate} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@transitops.com"
            value={createEmail}
            onChange={e => setCreateEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={createPassword}
            onChange={e => setCreatePassword(e.target.value)}
            required
          />
          <Select
            label="System Role"
            options={roleOptions}
            value={createRole}
            onChange={e => setCreateRole(e.target.value)}
          />

          {createError && (
            <p className="text-[var(--destructive)] text-xs font-medium" style={{ fontSize: "var(--text-caption)" }}>
              {createError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        title="Edit User Details"
      >
        <form onSubmit={onSubmitEdit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@transitops.com"
            value={editEmail}
            onChange={e => setEditEmail(e.target.value)}
            required
          />
          <Select
            label="System Role"
            options={roleOptions}
            value={editRole}
            onChange={e => setEditRole(e.target.value)}
          />

          {editError && (
            <p className="text-[var(--destructive)] text-xs font-medium" style={{ fontSize: "var(--text-caption)" }}>
              {editError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
