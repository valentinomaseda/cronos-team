import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AchievementModal({ achievement, isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Iniciar en frente
      setIsFlipped(false)
      // Animar el giro después de un pequeño delay
      const timer = setTimeout(() => {
        setIsFlipped(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    // Prevenir scroll cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !achievement) return null

  const Icon = achievement.icon

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-[#0697d8] transition-colors z-10"
        >
          <X size={32} strokeWidth={2.5} />
        </button>

        {/* Card con efecto flip */}
        <div className="relative w-full h-96 preserve-3d" style={{ perspective: '1000px' }}>
          <div 
            className={`relative w-full h-full transition-all duration-700 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            {/* Frente de la card */}
            <div 
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1e1e1e] to-[#1e1e1e] rounded-3xl border-4 flex flex-col items-center justify-center p-8"
              style={{ 
                borderColor: achievement.color,
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <Icon
                size={120}
                style={{ color: achievement.color }}
                className="mb-6 animate-bounce"
                strokeWidth={2}
              />
              <h2 className="text-3xl font-black text-[#ffffff] text-center mb-2">
                {achievement.name}
              </h2>
              <div 
                className="w-20 h-1 rounded-full mb-4"
                style={{ backgroundColor: achievement.color }}
              />
              <p className="text-sm text-gray-400 text-center">
                Toca para ver más detalles
              </p>
            </div>

            {/* Reverso de la card */}
            <div 
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1e1e1e] to-[#1e1e1e] rounded-3xl border-4 flex flex-col p-8 rotate-y-180"
              style={{ 
                borderColor: achievement.color,
                transform: 'translateZ(0) rotateY(180deg)',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              {/* Icono pequeño en la esquina */}
              <div className="flex items-start justify-between mb-6">
                <Icon
                  size={48}
                  style={{ color: achievement.color }}
                  strokeWidth={2.5}
                />
                <div 
                  className="px-4 py-2 rounded-full text-sm font-bold text-[#1e1e1e]"
                  style={{ backgroundColor: achievement.color }}
                >
                  Desbloqueado
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-black text-[#ffffff] mb-4">
                  {achievement.name}
                </h3>
                
                <div 
                  className="w-16 h-1 rounded-full mb-6"
                  style={{ backgroundColor: achievement.color }}
                />

                <p className="text-lg text-[#ffffff] leading-relaxed mb-6">
                  {achievement.description}
                </p>

                {/* Requisito */}
                <div className="bg-[#1e1e1e] rounded-xl p-4 border-2" style={{ borderColor: achievement.color }}>
                  <p className="text-sm text-gray-400 mb-1">Requisito:</p>
                  <p className="text-base font-semibold" style={{ color: achievement.color }}>
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Hint para cerrar */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Toca fuera para cerrar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
