import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block mb-1.5 font-medium text-[var(--brand-ink-muted)]" style={{ fontSize: "var(--text-caption)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full appearance-none bg-[var(--background)] border border-[var(--input)] rounded-[var(--radius-md)]",
            "text-[var(--brand-ink)]",
            "focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]",
            "transition-colors duration-150 px-3 pr-10 py-2"
          )}
          style={{ fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-body-sm)" }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-ink-muted)] pointer-events-none"
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
