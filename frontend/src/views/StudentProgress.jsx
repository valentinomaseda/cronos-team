import { useState } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAppContext } from '../context/AppContext'
import AchievementBadges from '../components/AchievementBadges'

export default function StudentProgress() {
  const { user, myRoutines } = useAppContext()
  const [timeRange, setTimeRange] = useState('month') // week, month, year

  // Calcular estadísticas
  const totalRoutines = myRoutines?.length || 0
  const completedRoutines = myRoutines?.filter(r => r.status === 'completada').length || 0
  const incompleteRoutines = myRoutines?.filter(r => r.status === 'incompleta').length || 0
  const pendingRoutines = myRoutines?.filter(r => r.status === 'activa').length || 0
  
  const completionRate = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0
  
  // Calcular promedio de rendimiento
  const progressData = myRoutines
    ?.filter(r => r.status === 'completada' || r.status === 'incompleta')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((routine, index) => ({
      sesion: `S${index + 1}`,
      rendimiento: routine.status === 'completada' ? 100 : 50,
      fecha: routine.date
    })) || []
  
  const averagePerformance = progressData.length > 0 
    ? Math.round(progressData.reduce((sum, item) => sum + item.rendimiento, 0) / progressData.length)
    : 0

  // Racha eliminada para MVP en producción
  const streak = { current: 0, longest: 0 }

  // Estadísticas para logros
  const achievementStats = {
    completedRoutines,
    currentStreak: 0,
    completionRate,
    averagePerformance
  }

  // Datos para gráfico de barras por mes
  const routinesByMonth = myRoutines?.reduce((acc, routine) => {
    const month = new Date(routine.date).toLocaleDateString('es-ES', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { completadas: 0, incompletas: 0, pendientes: 0 }
    }
    if (routine.status === 'completada') acc[month].completadas++
    else if (routine.status === 'incompleta') acc[month].incompletas++
    else acc[month].pendientes++
    return acc
  }, {}) || {}

  const monthlyData = Object.entries(routinesByMonth).map(([mes, data]) => ({
    mes,
    ...data
  }))

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <TrendingUp className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#F3F4F6]">Mi Progreso</h2>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-4 animate-scale-in border border-[#00BFFF]/20">
          <p className="text-xs text-[#00BFFF] mb-1">Total Rutinas</p>
          <p className="text-3xl font-bold text-[#F3F4F6]">{totalRoutines}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-4 animate-scale-in border border-green-400/20" style={{ animationDelay: '100ms' }}>
          <p className="text-xs text-green-200 mb-1">Completadas</p>
          <p className="text-3xl font-bold text-white">{completedRoutines}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl shadow-lg p-4 animate-scale-in border border-yellow-400/20" style={{ animationDelay: '200ms' }}>
          <p className="text-xs text-yellow-200 mb-1">Incompletas</p>
          <p className="text-3xl font-bold text-white">{incompleteRoutines}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg p-4 animate-scale-in border border-gray-400/20" style={{ animationDelay: '300ms' }}>
          <p className="text-xs text-gray-200 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-white">{pendingRoutines}</p>
        </div>
      </div>

      {/* Tasa de completado */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-200 border border-[#00BFFF]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#F3F4F6]">Tasa de Completado</h3>
          <span className="text-3xl font-bold text-[#00BFFF]">{completionRate}%</span>
        </div>
        <div className="w-full bg-[#111827] rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00BFFF] to-[#00FF88] h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {completedRoutines} de {totalRoutines} rutinas completadas
        </p>
      </div>

      {/* Racha eliminada para MVP */}

      {/* Sistema de logros */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-300 border border-[#00BFFF]/20">
        <AchievementBadges stats={achievementStats} />
      </div>

      {/* Gráfico de rendimiento a lo largo del tiempo */}
      {progressData.length > 0 && (
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-300 border border-[#00BFFF]/20">
          <h3 className="text-lg font-bold text-[#F3F4F6] mb-4">Rendimiento en el Tiempo</h3>
          <div className="bg-[#111827] rounded-lg p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" />
                <XAxis dataKey="sesion" stroke="#F3F4F6" />
                <YAxis domain={[0, 100]} stroke="#F3F4F6" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '2px solid #00BFFF', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line
                  type="monotone"
                  dataKey="rendimiento"
                  stroke="#00BFFF"
                  strokeWidth={3}
                  dot={{ fill: '#00BFFF', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            100% = Completada | 50% = Incompleta
          </p>
        </div>
      )}

      {/* Gráfico de barras por mes */}
      {monthlyData.length > 0 && (
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-400 border border-[#00BFFF]/20">
          <h3 className="text-lg font-bold text-[#F3F4F6] mb-4">Rutinas por Mes</h3>
          <div className="bg-[#111827] rounded-lg p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" />
                <XAxis dataKey="mes" stroke="#F3F4F6" />
                <YAxis stroke="#F3F4F6" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '2px solid #00BFFF', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="completadas" fill="#10B981" name="Completadas" />
                <Bar dataKey="incompletas" fill="#F59E0B" name="Incompletas" />
                <Bar dataKey="pendientes" fill="#6B7280" name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Historial reciente */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-500 border border-[#00BFFF]/20">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="text-[#00BFFF]" size={20} />
          <h3 className="text-lg font-bold text-[#F3F4F6]">Actividad Reciente</h3>
        </div>
        
        {myRoutines && myRoutines.length > 0 ? (
          <div className="space-y-2">
            {myRoutines
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((routine, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#111827] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-[#F3F4F6]">{routine.name}</p>
                    <p className="text-xs text-[#00BFFF]">{routine.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    routine.status === 'completada' ? 'bg-green-600 text-white' :
                    routine.status === 'incompleta' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {routine.status === 'completada' ? 'Completada' :
                     routine.status === 'incompleta' ? 'Incompleta' :
                     'Pendiente'}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No hay actividad registrada aún
          </p>
        )}
      </div>
    </div>
  )
}
