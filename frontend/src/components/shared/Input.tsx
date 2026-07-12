import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

export function Input({ label, error, leftIcon, className, ...props }: InputProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block mb-1.5 font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[var(--brand-ink-muted)]">{leftIcon}</span>
        )}
        <input
          className={cn(
            "w-full bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)]",
            "text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-faint)]",
            "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]",
            "transition-colors duration-150",
            leftIcon ? "pl-10 pr-3" : "px-3",
            "py-2"
          )}
          style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-[var(--destructive)]" style={{ fontSize: "var(--text-caption)" }}>
          {error}
        </p>
      )}
    </div>
  )
}
