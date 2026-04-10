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
        return <CheckCircle2 size={24} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
      case 'error':
        return <AlertCircle size={24} className="text-red-400 flex-shrink-0" strokeWidth={2.5} />
      case 'warning':
        return <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" strokeWidth={2.5} />
      default:
        return <Info size={24} className="text-[#00BFFF] flex-shrink-0" strokeWidth={2.5} />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'from-green-600 to-green-800'
      case 'error':
        return 'from-red-600 to-red-800'
      case 'warning':
        return 'from-yellow-600 to-yellow-800'
      default:
        return 'from-[#1E40AF] to-[#152e6b]'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-400'
      case 'error':
        return 'border-red-400'
      case 'warning':
        return 'border-yellow-400'
      default:
        return 'border-[#00BFFF]'
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div 
        className={`
          bg-gradient-to-r ${getBgColor()} 
          text-white rounded-xl shadow-lg border-2 ${getBorderColor()}
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
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all active:scale-95 flex-shrink-0"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
