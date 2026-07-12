import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

interface MainContentProps {
  className?: string
}

export function MainContent({ className }: MainContentProps) {
  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto bg-[var(--brand-canvas-soft)]",
        "p-[var(--space-md)] md:p-[var(--space-lg)]",
        className
      )}
    >
      <Outlet />
    </main>
  )
}
