import { AppShellProvider } from "./AppShellProvider"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileDrawer } from "./MobileDrawer"
import { MainContent } from "./MainContent"

export function AppShell() {
  return (
    <AppShellProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--brand-canvas-soft)]">
        <MobileDrawer />
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <MainContent />
        </div>
      </div>
    </AppShellProvider>
  )
}
