import { Flame, Calendar } from 'lucide-react'

export default function StreakDisplay({ currentStreak = 0, longestStreak = 0 }) {
  const getFlameColor = () => {
    if (currentStreak >= 30) return '#e91a20'
    if (currentStreak >= 14) return '#41bc7b'
    if (currentStreak >= 7) return '#0697d8'
    if (currentStreak >= 3) return '#41bc7b'
    return '#0697d8' // Azul por defecto
  }

  const getStreakMessage = () => {
    if (currentStreak === 0) return '¡Comienza tu racha hoy!'
    if (currentStreak === 1) return '¡Buen comienzo!'
    if (currentStreak < 7) return '¡Sigue así!'
    if (currentStreak < 14) return '¡Excelente racha!'
    if (currentStreak < 30) return '¡Imparable!'
    return '¡Leyenda viviente!'
  }

  return (
    <div className="bg-gradient-to-br from-[#0697d8] to-[#1e1e1e] rounded-xl shadow-lg p-6 border border-[#0697d8]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#ffffff]">Racha de Entrenamiento</h3>
        <div className="animate-pulse">
          <Flame 
            size={32} 
            style={{ color: getFlameColor() }}
            strokeWidth={2.5}
            className={currentStreak > 0 ? 'animate-bounce' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Racha actual */}
        <div className="bg-[#1e1e1e] rounded-lg p-4 text-center border-2" style={{ borderColor: getFlameColor() }}>
          <p className="text-4xl font-bold mb-1" style={{ color: getFlameColor() }}>
            {currentStreak}
          </p>
          <p className="text-xs text-gray-400 font-semibold">Días Seguidos</p>
        </div>

        {/* Mejor racha */}
        <div className="bg-[#1e1e1e] rounded-lg p-4 text-center border-2 border-[#0697d8]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar size={20} className="text-[#0697d8]" />
            <p className="text-4xl font-bold text-[#0697d8]">
              {longestStreak}
            </p>
          </div>
          <p className="text-xs text-gray-400 font-semibold">Mejor Racha</p>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold" style={{ color: getFlameColor() }}>
          {getStreakMessage()}
        </p>
      </div>

      {/* Barra de progreso hacia siguiente hito */}
      {currentStreak < 30 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Siguiente hito:</span>
            <span>
              {currentStreak < 7 ? '7 días' : currentStreak < 14 ? '14 días' : '30 días'}
            </span>
          </div>
          <div className="w-full bg-[#1e1e1e] rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${
                  currentStreak < 7 
                    ? (currentStreak / 7) * 100 
                    : currentStreak < 14 
                    ? ((currentStreak - 7) / 7) * 100
                    : ((currentStreak - 14) / 16) * 100
                }%`,
                backgroundColor: getFlameColor()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
