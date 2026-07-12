import { useState, useEffect, useCallback, useMemo } from "react"
import toast from "react-hot-toast"
import { usersApi } from "@/api"
import type { UserResponse, UserCreate, UserUpdate } from "@/api/types"

export function useUsers() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await usersApi.getUsers()
      setUsers(data)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to load users"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async (data: UserCreate) => {
    const toastId = toast.loading("Creating user...")
    try {
      await usersApi.createUser(data)
      toast.success("User created successfully", { id: toastId })
      setIsCreateOpen(false)
      fetchUsers()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to create user"
      toast.error(msg, { id: toastId })
    }
  }

  const handleUpdateUser = async (userId: number, data: UserUpdate) => {
    const toastId = toast.loading("Updating user...")
    try {
      await usersApi.updateUser(userId, data)
      toast.success("User updated successfully", { id: toastId })
      setIsEditOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to update user"
      toast.error(msg, { id: toastId })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    const toastId = toast.loading("Deleting user...")
    try {
      await usersApi.deleteUser(userId)
      toast.success("User deleted successfully", { id: toastId })
      fetchUsers()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to delete user"
      toast.error(msg, { id: toastId })
    }
  }

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return users
    return users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const openEditModal = (user: UserResponse) => {
    setEditingUser(user)
    setIsEditOpen(true)
  }

  const closeEditModal = () => {
    setEditingUser(null)
    setIsEditOpen(false)
  }

  return {
    users: filteredUsers,
    isLoading,
    error,
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
    refetch: fetchUsers,
  }
}
