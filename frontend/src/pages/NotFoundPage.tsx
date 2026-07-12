import { Link } from "react-router-dom"
import { useEffect } from "react"

export function NotFoundPage() {
  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    const iconLink = document.createElement("link")
    iconLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
    iconLink.rel = "stylesheet"
    document.head.appendChild(iconLink)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(iconLink)
    }
  }, [])

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex items-center justify-center p-[24px] overflow-hidden relative selection:bg-[#0075de] selection:text-[#fffeff] font-['Inter',sans-serif]">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #353534 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0075de] opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-2xl flex flex-col items-center justify-center text-center relative z-10 p-[24px]">
        {/* Typography */}
        <h1 className="text-[120px] sm:text-[180px] font-bold text-[#e5e2e1] mb-2 leading-none tracking-tighter">
          404
        </h1>
        
        <h2 className="text-[18px] sm:text-[24px] font-semibold text-[#a8c8ff] mb-6">Page Not Found</h2>
        
        <p className="text-[16px] text-[#c1c6d5] max-w-md mx-auto mb-10 leading-relaxed">
          The operational data or route requested is currently unavailable, archived, or out of sector bounds.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <Link 
            to="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#0075de] text-[#fffeff] text-[12px] font-medium rounded-full hover:bg-[#005eb4] transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
