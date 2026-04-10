import { useMemo } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAppContext } from '../context/AppContext'
import AchievementBadges from '../components/AchievementBadges'

export default function StudentProgress() {
  const { myRoutines } = useAppContext()

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

  const monthlyData = useMemo(() => Object.entries(routinesByMonth).map(([mes, data]) => ({
    mes,
    ...data
  })), [routinesByMonth])

  return (
    <div className="page-shell space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <TrendingUp className="text-brandBlue" size={28} strokeWidth={2.5} />
        <h2 className="title-section">Mi Progreso</h2>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card animate-scale-in">
          <p className="text-xs text-text-muted mb-1">Total Rutinas</p>
          <p className="text-3xl font-bold text-text">{totalRoutines}</p>
        </div>

        <div className="metric-card animate-scale-in" style={{ animationDelay: '100ms' }}>
          <p className="text-xs text-text-muted mb-1">Completadas</p>
          <p className="text-3xl font-bold text-success">{completedRoutines}</p>
        </div>

        <div className="metric-card animate-scale-in" style={{ animationDelay: '200ms' }}>
          <p className="text-xs text-text-muted mb-1">Incompletas</p>
          <p className="text-3xl font-bold text-brandBlue">{incompleteRoutines}</p>
        </div>

        <div className="metric-card animate-scale-in" style={{ animationDelay: '300ms' }}>
          <p className="text-xs text-text-muted mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-text">{pendingRoutines}</p>
        </div>
      </div>

      {/* Tasa de completado */}
      <div className="surface-brand p-6 animate-slide-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text">Tasa de Completado</h3>
          <span className="text-3xl font-bold text-brandBlue">{completionRate}%</span>
        </div>
        <div className="w-full bg-bg rounded-full h-4 overflow-hidden border border-border/60">
          <div
            className="bg-brandBlue h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-text-muted mt-2">
          {completedRoutines} de {totalRoutines} rutinas completadas
        </p>
      </div>

      {/* Racha eliminada para MVP */}

      {/* Sistema de logros */}
      <div className="surface-brand p-6 animate-slide-in-up delay-300">
        <AchievementBadges stats={achievementStats} />
      </div>

      {/* Gráfico de rendimiento a lo largo del tiempo */}
      {progressData.length > 0 && (
        <div className="surface-brand p-6 animate-slide-in-up delay-300">
          <h3 className="text-lg font-bold text-text mb-4">Rendimiento en el Tiempo</h3>
          <div className="bg-bg-surface rounded-lg p-4 border border-border" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-brandBlue)" />
                <XAxis dataKey="sesion" stroke="var(--color-text)" />
                <YAxis domain={[0, 100]} stroke="var(--color-text)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--color-text)' }}
                />
                <Line
                  type="monotone"
                  dataKey="rendimiento"
                  stroke="var(--color-brandBlue)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-brandBlue)', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-muted mt-2 text-center">
            100% = Completada | 50% = Incompleta
          </p>
        </div>
      )}

      {/* Gráfico de barras por mes */}
      {monthlyData.length > 0 && (
        <div className="surface-brand p-6 animate-slide-in-up delay-400">
          <h3 className="text-lg font-bold text-text mb-4">Rutinas por Mes</h3>
          <div className="bg-bg-surface rounded-lg p-4 border border-border" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-brandBlue)" />
                <XAxis dataKey="mes" stroke="var(--color-text)" />
                <YAxis stroke="var(--color-text)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--color-text)' }}
                />
                <Bar dataKey="completadas" fill="var(--color-success)" name="Completadas" />
                <Bar dataKey="incompletas" fill="var(--color-primary)" name="Incompletas" />
                <Bar dataKey="pendientes" fill="var(--color-brandBlue)" name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Historial reciente */}
      <div className="surface-brand p-6 animate-slide-in-up delay-500">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="text-brandBlue" size={20} />
          <h3 className="text-lg font-bold text-text">Actividad Reciente</h3>
        </div>
        
        {myRoutines && myRoutines.length > 0 ? (
          <div className="space-y-2">
            {myRoutines
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((routine, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border/70"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-text">{routine.name}</p>
                    <p className="text-xs text-brandBlue">{routine.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    routine.status === 'completada' ? 'bg-success text-white' :
                    routine.status === 'incompleta' ? 'bg-brandBlue text-white' :
                    'bg-bg text-text'
                  }`}>
                    {routine.status === 'completada' ? 'Completada' :
                     routine.status === 'incompleta' ? 'Incompleta' :
                     'Pendiente'}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">
            No hay actividad registrada aún
          </p>
        )}
      </div>
    </div>
  )
}
