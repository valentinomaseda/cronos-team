import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export default function Toast({ isOpen, onClose, message, type = 'info', duration = 4000 }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsExiting(false)
      
      // Auto-cerrar después del duration
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration])

  const handleClose = () => {
    setIsExiting(true)
    // Esperar a que termine la animación antes de cerrar completamente
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen && !isExiting) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={24} className="text-success flex-shrink-0" strokeWidth={2.5} />
      case 'error':
        return <AlertCircle size={24} className="text-primary flex-shrink-0" strokeWidth={2.5} />
      case 'warning':
        return <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" strokeWidth={2.5} />
      default:
        return <Info size={24} className="text-brandBlue flex-shrink-0" strokeWidth={2.5} />
    }
  }

  const getSurfaceClass = () => {
    switch (type) {
      case 'success':
        return 'bg-bg-surface border-success/40'
      case 'error':
        return 'bg-bg-surface border-primary/40'
      case 'warning':
        return 'bg-bg-surface border-primary/40'
      default:
        return 'bg-bg-surface border-border'
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div 
        className={`
          ${getSurfaceClass()}
          text-text rounded-xl shadow-lg border
          max-w-md w-full p-4 pointer-events-auto
          flex items-center gap-3
          ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'}
        `}
      >
        {getIcon()}
        
        <p className="flex-1 font-semibold text-sm leading-relaxed">
          {message}
        </p>

        <button
          onClick={handleClose}
          className="p-1 hover:bg-bg rounded-full transition-all active:scale-95 flex-shrink-0"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
