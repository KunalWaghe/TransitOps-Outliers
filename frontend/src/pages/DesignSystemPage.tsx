import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import {
  AppShellProvider,
  Header,
  HeaderActions,
  MobileDrawer,
  Sidebar,
  SidebarCollapseButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  useSidebar,
} from "@/components/app-shell"
import { NAV_GROUPS } from "@/components/app-shell/constants"
import type { NavItem } from "@/components/app-shell/types"

function DesignSystemSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-[var(--space-md)]">
      <div>
        <h2
          className="font-bold text-[var(--brand-ink)]"
          style={{
            fontSize: "var(--text-heading-3)",
            lineHeight: "var(--leading-heading-3)",
            letterSpacing: "var(--tracking-heading-3)",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-[var(--space-xxs)] text-[var(--brand-ink-muted)]"
            style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--brand-hairline)]
          bg-[var(--brand-surface)] p-[var(--space-lg)]"
      >
        {children}
      </div>
    </section>
  )
}

function ColorSwatch({ label, token }: { label: string; token: string }) {
  return (
    <div className="space-y-[var(--space-xs)]">
      <div
        className="h-16 rounded-[var(--radius-md)] border border-[var(--brand-hairline)]"
        style={{ backgroundColor: `var(${token})` }}
      />
      <p
        className="text-[var(--brand-ink-secondary)]"
        style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}
      >
        {label}
      </p>
      <p
        className="font-mono text-[var(--brand-ink-faint)]"
        style={{ fontSize: "var(--text-eyebrow)" }}
      >
        {token}
      </p>
    </div>
  )
}

function TypographySample({
  label,
  token,
  weight = "normal",
}: {
  label: string
  token: string
  weight?: string
}) {
  return (
    <div className="border-b border-[var(--brand-hairline)] pb-[var(--space-sm)] last:border-0">
      <p
        className="mb-1 text-[var(--brand-ink-faint)] uppercase"
        style={{
          fontSize: "var(--text-eyebrow)",
          lineHeight: "var(--leading-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
        }}
      >
        {label}
      </p>
      <p
        className="text-[var(--brand-ink)]"
        style={{
          fontSize: `var(--text-${token})`,
          lineHeight: `var(--leading-${token})`,
          letterSpacing: `var(--tracking-${token})`,
          fontWeight: weight,
        }}
      >
        TransitOps fleet management
      </p>
    </div>
  )
}

function BreadcrumbsDemo() {
  const crumbs = ["Fleet", "Vehicles"]

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={crumb} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                size={12}
                aria-hidden="true"
                className="text-[var(--brand-ink-faint)]"
              />
            )}
            {i < crumbs.length - 1 ? (
              <span
                className="text-[var(--brand-ink-muted)]"
                style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}
              >
                {crumb}
              </span>
            ) : (
              <span
                aria-current="page"
                className="font-medium text-[var(--brand-ink)]"
                style={{ fontSize: "var(--text-caption)", lineHeight: "var(--leading-caption)" }}
              >
                {crumb}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function MobileDrawerDemo() {
  const { openMobileDrawer } = useSidebar()

  return (
    <div className="space-y-[var(--space-md)]">
      <button
        type="button"
        onClick={openMobileDrawer}
        className="rounded-[var(--radius-md)] bg-[var(--brand-primary)] px-[var(--space-md)] py-[var(--space-sm)]
          text-white transition-colors hover:bg-[var(--brand-primary-active)]"
        style={{ fontSize: "var(--text-button)", lineHeight: "var(--leading-button)" }}
      >
        Open mobile drawer
      </button>
      <MobileDrawer />
    </div>
  )
}

const demoItemWithBadge: NavItem = {
  id: "trips-demo",
  label: "Trips",
  icon: "Route",
  to: "/designsystem",
  badge: 3,
}

export function DesignSystemPage() {
  const mainGroup = NAV_GROUPS[0]

  return (
    <div className="min-h-screen bg-[var(--brand-canvas-soft)]">
      <header
        className="sticky top-0 z-20 border-b border-[var(--brand-hairline)] bg-[var(--brand-surface)]
          px-[var(--space-md)] md:px-[var(--space-lg)]"
      >
        <div
          className="mx-auto flex h-14 max-w-5xl items-center justify-between"
        >
          <h1
            className="font-bold text-[var(--brand-ink)]"
            style={{
              fontSize: "var(--text-title)",
              lineHeight: "var(--leading-title)",
              letterSpacing: "var(--tracking-title)",
            }}
          >
            Design System
          </h1>
          <Link
            to="/"
            className="text-[var(--brand-primary)] hover:underline"
            style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
          >
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-[var(--space-xxl)] p-[var(--space-md)] md:p-[var(--space-lg)]">
        <p
          className="text-[var(--brand-ink-muted)]"
          style={{ fontSize: "var(--text-body-md)", lineHeight: "var(--leading-body-md)" }}
        >
          Component catalog for the TransitOps app shell. All values use existing CSS variables from{" "}
          <code className="text-[var(--brand-ink-secondary)]">index.css</code>.
        </p>

        <DesignSystemSection title="Brand colors" description="Core palette tokens.">
          <div className="grid grid-cols-2 gap-[var(--space-md)] sm:grid-cols-3 md:grid-cols-4">
            <ColorSwatch label="Primary" token="--brand-primary" />
            <ColorSwatch label="Primary active" token="--brand-primary-active" />
            <ColorSwatch label="Secondary" token="--brand-secondary" />
            <ColorSwatch label="Canvas" token="--brand-canvas" />
            <ColorSwatch label="Canvas soft" token="--brand-canvas-soft" />
            <ColorSwatch label="Surface" token="--brand-surface" />
            <ColorSwatch label="Ink" token="--brand-ink" />
            <ColorSwatch label="Ink muted" token="--brand-ink-muted" />
            <ColorSwatch label="Hairline" token="--brand-hairline" />
            <ColorSwatch label="Accent green" token="--brand-accent-green" />
            <ColorSwatch label="Accent orange" token="--brand-accent-orange" />
            <ColorSwatch label="Accent teal" token="--brand-accent-teal" />
          </div>
        </DesignSystemSection>

        <DesignSystemSection title="Typography" description="Inter scale from design tokens.">
          <div className="space-y-[var(--space-md)]">
            <TypographySample label="Heading 1" token="heading-1" weight="700" />
            <TypographySample label="Heading 2" token="heading-2" weight="700" />
            <TypographySample label="Heading 3" token="heading-3" weight="700" />
            <TypographySample label="Title" token="title" weight="600" />
            <TypographySample label="Body MD" token="body-md" />
            <TypographySample label="Body SM" token="body-sm" />
            <TypographySample label="Caption" token="caption" />
            <TypographySample label="Eyebrow" token="eyebrow" weight="600" />
          </div>
        </DesignSystemSection>

        <DesignSystemSection title="Spacing & radius" description="Layout primitives.">
          <div className="grid gap-[var(--space-lg)] md:grid-cols-2">
            <div className="space-y-[var(--space-sm)]">
              {(["xxs", "xs", "sm", "md", "lg", "xl", "xxl"] as const).map(size => (
                <div key={size} className="flex items-center gap-[var(--space-sm)]">
                  <div
                    className="h-4 rounded-[var(--radius-xs)] bg-[var(--brand-primary)]"
                    style={{ width: `var(--space-${size})` }}
                  />
                  <span
                    className="text-[var(--brand-ink-muted)]"
                    style={{ fontSize: "var(--text-caption)" }}
                  >
                    --space-{size}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-[var(--space-md)]">
              {(["xs", "sm", "md", "lg", "xl", "full"] as const).map(size => (
                <div
                  key={size}
                  className="flex h-16 w-16 items-center justify-center border border-[var(--brand-hairline)]
                    bg-[var(--brand-canvas-soft)] text-[var(--brand-ink-faint)]"
                  style={{
                    borderRadius: `var(--radius-${size})`,
                    fontSize: "var(--text-eyebrow)",
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        </DesignSystemSection>

        <AppShellProvider>
          <DesignSystemSection
            title="SidebarHeader"
            description="Logo and product name. Collapses to icon-only when sidebar is collapsed."
          >
            <div className="max-w-xs overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)]">
              <SidebarHeader />
            </div>
          </DesignSystemSection>

          <DesignSystemSection
            title="SidebarItem"
            description="Navigation row — default, hover, and active states. Includes badge variant."
          >
            <div className="grid gap-[var(--space-lg)] md:grid-cols-2">
              <div className="max-w-xs space-y-1 rounded-[var(--radius-md)] border border-[var(--brand-hairline)] p-[var(--space-xs)]">
                <SidebarItem item={mainGroup.items[1]} />
                <SidebarItem item={mainGroup.items[2]} />
              </div>
              <div className="max-w-xs space-y-1 rounded-[var(--radius-md)] border border-[var(--brand-hairline)] p-[var(--space-xs)]">
                <SidebarItem item={demoItemWithBadge} />
              </div>
            </div>
          </DesignSystemSection>

          <DesignSystemSection title="SidebarGroup" description="Grouped nav with optional section label.">
            <div className="max-w-xs rounded-[var(--radius-md)] border border-[var(--brand-hairline)] p-[var(--space-xs)]">
              <SidebarGroup group={NAV_GROUPS[1]} />
            </div>
          </DesignSystemSection>

          <DesignSystemSection title="SidebarContent" description="Scrollable navigation area.">
            <div
              className="max-w-xs overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)]
                h-72 flex flex-col"
            >
              <SidebarContent />
            </div>
          </DesignSystemSection>

          <DesignSystemSection
            title="SidebarCollapseButton & SidebarFooter"
            description="Collapse control and theme toggle."
          >
            <div className="max-w-xs overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)]">
              <SidebarCollapseButton />
              <SidebarFooter />
            </div>
          </DesignSystemSection>

          <DesignSystemSection
            title="Sidebar (full)"
            description="Complete sidebar assembly. Use the collapse button to preview collapsed mode."
          >
            <div
              className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)]
                h-[28rem] [&_aside]:!flex"
            >
              <Sidebar />
            </div>
          </DesignSystemSection>

          <DesignSystemSection title="Header" description="Top bar with breadcrumbs slot and actions.">
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)]">
              <Header />
            </div>
          </DesignSystemSection>

          <DesignSystemSection title="HeaderActions" description="Notification and user avatar controls.">
            <HeaderActions />
          </DesignSystemSection>

          <DesignSystemSection title="Breadcrumbs" description="Route-driven breadcrumb trail.">
            <BreadcrumbsDemo />
          </DesignSystemSection>

          <DesignSystemSection title="MobileDrawer" description="Mobile navigation overlay.">
            <MobileDrawerDemo />
          </DesignSystemSection>

          <DesignSystemSection title="MainContent" description="Page canvas where routed content renders.">
            <div
              className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-hairline)] h-48"
            >
              <div className="flex h-full flex-col">
                <div
                  className="flex flex-1 items-center justify-center bg-[var(--brand-canvas-soft)]
                    p-[var(--space-lg)] text-[var(--brand-ink-faint)]"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  MainContent wraps &lt;Outlet /&gt; in the live app shell
                </div>
              </div>
            </div>
          </DesignSystemSection>
        </AppShellProvider>
      </main>
    </div>
  )
}
