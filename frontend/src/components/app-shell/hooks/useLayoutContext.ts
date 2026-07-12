import { useContext } from "react"
import { LayoutContext } from "../LayoutContext"
import type { LayoutContextValue } from "../types"

export function useLayoutContext(): LayoutContextValue {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error("useLayoutContext must be used inside AppShellProvider")
  return ctx
}
