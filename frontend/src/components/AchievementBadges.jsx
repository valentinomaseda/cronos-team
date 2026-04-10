import { useState } from 'react'
import { Trophy, Flame, Target, Zap, Award, Star, TrendingUp, Medal } from 'lucide-react'
import AchievementModal from './AchievementModal'

const achievements = [
  {
    id: 'first_routine',
    name: 'Primera Rutina',
    description: 'Completaste tu primera rutina',
    icon: Star,
    color: '#FFD700',
    requirement: (stats) => stats.completedRoutines >= 1
  },
  {
    id: 'streak_7',
    name: 'Racha de Fuego',
    description: '7 días consecutivos entrenando',
    icon: Flame,
    color: '#FF4500',
    requirement: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'routines_10',
    name: 'Dedicación',
    description: '10 rutinas completadas',
    icon: Target,
    color: '#00BFFF',
    requirement: (stats) => stats.completedRoutines >= 10
  },
  {
    id: 'routines_25',
    name: 'Imparable',
    description: '25 rutinas completadas',
    icon: Zap,
    color: '#9D4EDD',
    requirement: (stats) => stats.completedRoutines >= 25
  },
  {
    id: 'routines_50',
    name: 'Campeón',
    description: '50 rutinas completadas',
    icon: Trophy,
    color: '#FFD700',
    requirement: (stats) => stats.completedRoutines >= 50
  },
  {
    id: 'completion_rate_80',
    name: 'Perfeccionista',
    description: '80% de tasa de completado',
    icon: Award,
    color: '#00FF88',
    requirement: (stats) => stats.completionRate >= 80
  },
  {
    id: 'streak_30',
    name: 'Guerrero',
    description: '30 días consecutivos',
    icon: Medal,
    color: '#FF6B6B',
    requirement: (stats) => stats.currentStreak >= 30
  },
  {
    id: 'progress_excellent',
    name: 'Progreso Excelente',
    description: 'Promedio de rendimiento 90%+',
    icon: TrendingUp,
    color: '#00BFFF',
    requirement: (stats) => stats.averagePerformance >= 90
  }
]

export default function AchievementBadges({ stats = {} }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const unlockedAchievements = achievements.filter(achievement => 
    achievement.requirement(stats)
  )

  const lockedAchievements = achievements.filter(achievement => 
    !achievement.requirement(stats)
  )

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Esperar a que termine la animación antes de limpiar el logro
    setTimeout(() => {
      setSelectedAchievement(null)
    }, 300)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#F3F4F6]">
          Logros Desbloqueados
        </h3>
        <div className="px-3 py-1 bg-[#00BFFF] text-[#111827] rounded-full font-bold text-sm">
          {unlockedAchievements.length}/{achievements.length}
        </div>
      </div>

      {/* Logros desbloqueados */}
      {unlockedAchievements.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {unlockedAchievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <button
                key={achievement.id}
                onClick={() => handleAchievementClick(achievement)}
                className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] p-4 rounded-xl border-2 animate-scale-in hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ borderColor: achievement.color }}
              >
                <Icon
                  size={32}
                  style={{ color: achievement.color }}
                  className="mx-auto mb-2"
                  strokeWidth={2.5}
                />
                <p className="text-xs font-bold text-center text-[#F3F4F6] leading-tight">
                  {achievement.name}
                </p>
              </button>
            )
          })}
        </div>
      )}

      {/* Logros bloqueados */}
      {lockedAchievements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Por Desbloquear</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedAchievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className="bg-[#111827] p-4 rounded-xl border-2 border-gray-700 opacity-50 hover:opacity-70 transition-opacity cursor-not-allowed"
                  title={`🔒 ${achievement.description}`}
                >
                  <Icon
                    size={32}
                    className="mx-auto mb-2 text-gray-600"
                    strokeWidth={2.5}
                  />
                  <p className="text-xs font-bold text-center text-gray-500 leading-tight">
                    {achievement.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal de logro */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
