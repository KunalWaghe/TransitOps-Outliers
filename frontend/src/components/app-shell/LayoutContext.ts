import { createContext } from "react"
import type { LayoutContextValue } from "./types"

export const LayoutContext = createContext<LayoutContextValue | null>(null)
