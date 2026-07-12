import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    // Focus the modal for accessibility
    modalRef.current?.focus()
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative bg-[var(--brand-surface)] border border-[var(--brand-hairline)] rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]",
          "w-full max-w-md transform transition-all duration-300 ease-out scale-100 flex flex-col focus:outline-none",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-hairline)]">
          <h3
            id="modal-title"
            className="font-semibold text-[var(--brand-ink)]"
            style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              "w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center",
              "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-canvas-soft)]",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            )}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {children}
        </div>
      </div>
    </div>
  )
}
