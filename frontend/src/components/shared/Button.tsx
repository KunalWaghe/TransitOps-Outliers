import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./LoadingSpinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  leftIcon,
  rightIcon,
  asChild,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--brand-primary-active)]",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] hover:bg-[var(--muted)]",
    ghost: "bg-transparent text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)] hover:text-[var(--brand-ink)]",
    danger: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--brand-accent-orange-deep)]",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-[var(--text-caption)]",
    md: "px-4 py-2 text-[var(--text-body-sm)]",
    lg: "px-6 py-3 text-[var(--text-body-md)]",
  }

  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  )

  if (asChild && props.onClick === undefined) {
    return (
      <span className={buttonClasses}>
        {isLoading && <LoadingSpinner size="sm" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </span>
    )
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}
