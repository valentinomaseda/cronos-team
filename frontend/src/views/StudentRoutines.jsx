import { useState, useEffect } from 'react'
import { Dumbbell, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Loader2, Save, MessageSquare, Check } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { rutinasAPI } from '../services/api'
import Confetti from '../components/Confetti'

// Helper para obtener el nombre de la unidad
const getUnitName = (type) => {
  const units = {
    'reps': 'repeticiones',
    'segundos': 'segundos',
    'minutos': 'minutos',
    'horas': 'horas',
    'km': 'km',
    'metros': 'metros'
  }
  return units[type] || type
}

export default function StudentRoutines() {
  const { user, myRoutines, updateRoutineStatus, loadMyRoutines, loading, showAlert } = useAppContext()
  const [expandedRoutine, setExpandedRoutine] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [exerciseStates, setExerciseStates] = useState({}) // Estado local de ejercicios
  const [savingExercises, setSavingExercises] = useState({}) // Estado de guardado por ejercicio

  // Cargar rutinas cuando el componente se monte
  useEffect(() => {
    if (user && user.rol === 'alumno' && (!myRoutines || myRoutines.length === 0)) {
      loadMyRoutines(user)
    }
  }, [user])

  // Inicializar estados de ejercicios cuando myRoutines cambie
  useEffect(() => {
    if (myRoutines && myRoutines.length > 0) {
      const initialStates = {}
      myRoutines.forEach(routine => {
        routine.exercises?.forEach((exercise, idx) => {
          // Usar orden si existe, sino usar índice como fallback para ejercicios duplicados
          const orden = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : idx
          const key = `${routine.id}-${routine.fechaAsignacion}-${orden}`
          
          initialStates[key] = {
            ejercicioCompletado: exercise.ejercicioCompletado || false,
            feedbackAlumno: exercise.feedbackAlumno || '',
            orden: orden // Guardar el orden usado
          }
        })
      })
      setExerciseStates(initialStates)
    }
  }, [myRoutines])

  const handleExerciseToggle = async (routine, exercise, idx) => {
    // Usar orden si existe, sino usar índice como fallback
    const orden = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : idx
    const key = `${routine.id}-${routine.fechaAsignacion}-${orden}`
    
    // Obtener el nuevo estado (invertido)
    const newCompletedState = !exerciseStates[key]?.ejercicioCompletado
    
    // Actualizar estado local inmediatamente para feedback visual
    setExerciseStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ejercicioCompletado: newCompletedState
      }
    }))
    
    // Guardar automáticamente en el backend
    try {
      const ordenForBackend = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : null
      
      await rutinasAPI.updateAlumnoEjercicio(
        routine.id,
        user.idPersona,
        exercise.id,
        {
          ejercicioCompletado: newCompletedState ? 1 : 0,
          feedbackAlumno: exerciseStates[key]?.feedbackAlumno || null
        },
        routine.fechaAsignacion,
        ordenForBackend
      )
      
      // Mostrar confirmación sutil
      showAlert(
        newCompletedState ? '✓ Ejercicio marcado como completado' : 'Ejercicio desmarcado', 
        'success'
      )
      
      // Verificar si TODOS los ejercicios de la rutina están completados
      if (newCompletedState) {
        const allExercisesCompleted = routine.exercises.every((ex, exIdx) => {
          const exOrden = ex.orden !== null && ex.orden !== undefined ? ex.orden : exIdx
          const exKey = `${routine.id}-${routine.fechaAsignacion}-${exOrden}`
          
          // Si es el ejercicio actual (recién marcado), ya sabemos que está completado
          if (exKey === key) return true
          
          // Para los demás, verificar el estado
          return exerciseStates[exKey]?.ejercicioCompletado === true
        })
        
        // Si todos están completados, marcar la rutina como completada
        if (allExercisesCompleted && routine.status !== 'completada') {
          try {
            await updateRoutineStatus(routine.id, 'completada', routine.fechaAsignacion)
            setShowConfetti(true)
            showAlert('¡Felicitaciones! Rutina completada 🎉', 'success', '¡Genial!')
            
            // Recargar rutinas para actualizar el estado visual
            await loadMyRoutines(user)
          } catch (error) {
            console.error('Error updating routine status:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error updating exercise:', error)
      
      // Revertir el estado local si falla
      setExerciseStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          ejercicioCompletado: !newCompletedState
        }
      }))
      
      showAlert('Error al guardar el cambio', 'error')
    }
  }

  const handleFeedbackChange = (routineId, fechaAsignacion, orden, feedback) => {
    const key = `${routineId}-${fechaAsignacion}-${orden}`
    setExerciseStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        feedbackAlumno: feedback
      }
    }))
  }

  const handleSaveExercise = async (routine, exercise, idx) => {
    // Usar orden si existe, sino usar índice como fallback SOLO para la key interna
    const ordenForKey = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : idx
    const key = `${routine.id}-${routine.fechaAsignacion}-${ordenForKey}`
    setSavingExercises(prev => ({ ...prev, [key]: true }))
    
    try {
      const state = exerciseStates[key]
      
      // IMPORTANTE: Solo enviar orden al backend si existe en el ejercicio
      // Si es null/undefined, no enviar para que el backend no lo use en el WHERE
      const ordenForBackend = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : null
      
      await rutinasAPI.updateAlumnoEjercicio(
        routine.id,
        user.idPersona,
        exercise.id,
        {
          ejercicioCompletado: state.ejercicioCompletado ? 1 : 0,
          feedbackAlumno: state.feedbackAlumno || null
        },
        routine.fechaAsignacion,
        ordenForBackend
      )
      
      showAlert('Ejercicio actualizado exitosamente', 'success')
      
      // Recargar rutinas para reflejar cambios
      await loadMyRoutines(user)
    } catch (error) {
      console.error('Error updating exercise:', error)
      showAlert('Error al actualizar el ejercicio', 'error')
    } finally {
      setSavingExercises(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleStatusUpdate = async (routineId, newStatus, fechaAsignacion) => {
    setUpdatingStatus(routineId)
    try {
      await updateRoutineStatus(routineId, newStatus, fechaAsignacion)
      // Activar confetti si se completó la rutina
      if (newStatus === 'completada') {
        setShowConfetti(true)
        showAlert('¡Felicitaciones! Rutina completada 🎉', 'success', '¡Genial!')
      }
    } catch (error) {
      console.error('Error updating routine status:', error)
      showAlert('Error al actualizar el estado de la rutina', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'border-green-400'
      case 'incompleta':
        return 'border-brandBlue/50'
      case 'activa':
      default:
        return 'border-border'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completada':
        return <CheckCircle2 className="text-success" size={28} strokeWidth={2.5} />
      case 'incompleta':
        return <Clock className="text-yellow-400" size={28} strokeWidth={2.5} />
      case 'activa':
      default:
        return <XCircle className="text-text-muted" size={28} strokeWidth={2.5} />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completada':
        return 'Completada'
      case 'incompleta':
        return 'Incompleta'
      case 'activa':
      default:
        return 'Pendiente'
    }
  }

  return (
    <div className="page-shell space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <Dumbbell className="text-brandBlue" size={28} strokeWidth={2.5} />
        <h2 className="title-section">Mis Rutinas</h2>
      </div>

      {/* Saludo */}
      <div className="surface-brand p-6 animate-slide-in-up">
        <div className="flex items-center space-x-4 mb-2">
          {user?.photo && (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
              <img src={user.photo} alt={user.nombre} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-text">
              ¡Hola, {user?.nombre?.split(' ')[0] || 'Atleta'}! 💪
            </h3>
            <p className="text-brandBlue">
              Tienes {myRoutines?.filter(r => r.status === 'activa').length || 0} {myRoutines?.filter(r => r.status === 'activa').length === 1 ? 'rutina pendiente' : 'rutinas pendientes'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de rutinas */}
      <div className="space-y-4">
        {loading ? (
          <div className="surface-brand rounded-xl p-12 text-center animate-pulse">
            <Dumbbell className="mx-auto text-brandBlue mb-4 animate-bounce" size={64} strokeWidth={2} />
            <h3 className="text-xl font-bold text-text mb-2">
              Cargando tus rutinas...
            </h3>
          </div>
        ) : !myRoutines || myRoutines.length === 0 ? (
          <div className="surface-brand rounded-xl p-12 text-center animate-scale-in">
            <Dumbbell className="mx-auto text-brandBlue mb-4" size={64} strokeWidth={2} />
            <h3 className="text-xl font-bold text-text mb-2">
              No tienes rutinas asignadas
            </h3>
            <p className="text-text-muted">
              Tu entrenador te asignará rutinas pronto. ¡Mantente atento!
            </p>
          </div>
        ) : (
          myRoutines.map((routine, index) => {
            // Crear un ID único que incluya la fecha de asignación
            const uniqueId = `${routine.id}-${routine.fechaAsignacion || routine.date}`;
            return (
            <div
              key={uniqueId}
              className={`bg-bg-surface rounded-xl shadow-sm overflow-hidden animate-slide-in-up border-2 ${getStatusColor(routine.status)}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header de la rutina */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text mb-1">{routine.name}</h3>
                    <p className="text-sm text-brandBlue">
                      Asignada: {routine.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(routine.status)}
                    <button
                      onClick={() => setExpandedRoutine(expandedRoutine === uniqueId ? null : uniqueId)}
                      className="p-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
                    >
                      {expandedRoutine === uniqueId ? (
                        <ChevronUp size={20} strokeWidth={2.5} />
                      ) : (
                        <ChevronDown size={20} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Estado actual */}
                <div className="flex items-center justify-between p-3 bg-bg rounded-lg mb-4 border border-border/70">
                  <span className="text-text font-semibold">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    routine.status === 'completada' ? 'bg-success text-white' :
                    routine.status === 'incompleta' ? 'bg-brandBlue text-white' :
                    'bg-bg text-text'
                  }`}>
                    {getStatusText(routine.status)}
                  </span>
                </div>

                {/* Botones de estado */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'completada', routine.fechaAsignacion)}
                    disabled={updatingStatus === routine.id || routine.status === 'completada'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      routine.status === 'completada'
                        ? 'bg-success text-white'
                        : 'bg-bg text-text hover:bg-success hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingStatus === routine.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      '✓ Completada'
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'incompleta', routine.fechaAsignacion)}
                    disabled={updatingStatus === routine.id || routine.status === 'incompleta'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      routine.status === 'incompleta'
                        ? 'bg-brandBlue text-white'
                        : 'bg-bg text-text hover:bg-brandBlue hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingStatus === routine.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      '◐ Incompleta'
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'activa', routine.fechaAsignacion)}
                    disabled={updatingStatus === routine.id || routine.status === 'activa'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      routine.status === 'activa'
                        ? 'bg-bg text-text'
                        : 'bg-bg text-text hover:bg-bg-surface hover:text-text'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingStatus === routine.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      '○ Pendiente'
                    )}
                  </button>
                </div>
              </div>

              {/* Detalles de ejercicios (expandible) */}
              {expandedRoutine === uniqueId && (
                <div className="border-t border-border p-6 bg-bg animate-slide-in-up">
                  <h4 className="text-lg font-bold text-brandBlue mb-4">
                    Ejercicios ({routine.exercises?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {routine.exercises && routine.exercises.length > 0 ? (
                      routine.exercises.map((exercise, idx) => {
                        // Usar orden si existe, sino usar índice como fallback
                        const orden = exercise.orden !== null && exercise.orden !== undefined ? exercise.orden : idx
                        const key = `${routine.id}-${routine.fechaAsignacion}-${orden}`
                        const exerciseState = exerciseStates[key] || {
                          ejercicioCompletado: exercise.ejercicioCompletado || false,
                          feedbackAlumno: exercise.feedbackAlumno || ''
                        }
                        const isSaving = savingExercises[key]
                        
                        return (
                        <div
                          key={idx}
                          className={`bg-bg-surface rounded-lg p-4 border ${
                            exerciseState.ejercicioCompletado ? 'border-green-500' : 'border-border'
                          }`}
                        >
                          {/* Header del ejercicio con checkbox y calentamiento */}
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-bold text-text flex items-center gap-2 flex-1">
                              {idx + 1}. {exercise.name}
                              {exercise.esCalentamiento === 1 && (
                                <span className="text-xs px-2 py-1 bg-brandBlue text-white rounded-full">
                                  🔥 Calentamiento
                                </span>
                              )}
                            </h5>
                            
                            {/* Toggle de completado */}
                            <button
                              onClick={() => handleExerciseToggle(routine, exercise, idx)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                                exerciseState.ejercicioCompletado
                                  ? 'bg-success text-white'
                                  : 'bg-bg text-text-muted'
                              }`}
                            >
                              <Check size={16} />
                              <span className="text-xs font-semibold">
                                {exerciseState.ejercicioCompletado ? 'Completado' : 'Marcar'}
                              </span>
                            </button>
                          </div>

                          {/* Información principal: Sets y Cantidad */}
                          <div className="flex flex-wrap gap-2 text-sm mb-3">
                            {(exercise.unidad === 'reps' || exercise.type === 'reps') && (
                              <span className="px-2 py-1 bg-brandBlue text-white rounded font-semibold">
                                {exercise.sets} {exercise.sets === 1 ? 'serie' : 'series'}
                              </span>
                            )}
                            <span className="px-2 py-1 bg-brandBlue text-white rounded font-semibold">
                              {exercise.value} {getUnitName(exercise.unidad || exercise.type)}
                            </span>
                            {exercise.pausaSeries && (
                              <span className="px-2 py-1 bg-brandBlue text-white rounded font-semibold">
                                ⏸️ Pausa: {exercise.pausaSeries}
                              </span>
                            )}
                            {exercise.intensidad && (
                              <span className="px-2 py-1 bg-brandBlue text-white rounded font-semibold">
                                ⚡ {exercise.intensidad}
                              </span>
                            )}
                          </div>

                          {/* Información del ejercicio base */}
                          {(exercise.distancia || exercise.duracion || exercise.descripcionIntervalo) && (
                            <div className="mb-3 p-3 bg-bg rounded border border-border/70">
                              <p className="text-xs text-text font-semibold mb-1">📋 Info del ejercicio:</p>
                              <div className="text-sm text-text-muted space-y-1">
                                {exercise.distancia && (
                                  <div>📏 Distancia: <span className="text-brandBlue font-semibold">{exercise.distancia}</span></div>
                                )}
                                {exercise.duracion && (
                                  <div>⏱️ Duración: <span className="text-brandBlue font-semibold">{exercise.duracion}</span></div>
                                )}
                                {exercise.descripcionIntervalo && (
                                  <div className="italic text-brandBlue">💭 "{exercise.descripcionIntervalo}"</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Especificaciones personalizadas */}
                          {exercise.especificaciones && (
                            <div className="mt-2 p-3 bg-bg rounded border border-border/70">
                              <p className="text-sm text-brandBlue font-semibold mb-1">📝 Especificaciones personalizadas:</p>
                              <p className="text-sm text-text">{exercise.especificaciones}</p>
                            </div>
                          )}

                          {/* Feedback del alumno */}
                          <div className="mt-3 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-brandBlue">
                              <MessageSquare size={16} />
                              Feedback para el entrenador:
                            </label>
                            <textarea
                              value={exerciseState.feedbackAlumno}
                              onChange={(e) => handleFeedbackChange(routine.id, routine.fechaAsignacion, orden, e.target.value)}
                              placeholder="Escribe tus comentarios sobre este ejercicio..."
                              className="w-full px-3 py-2 bg-bg-surface border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-brandBlue transition-colors resize-none"
                              rows="2"
                            />
                            
                            {/* Botón de guardar */}
                            <button
                              onClick={() => handleSaveExercise(routine, exercise, idx)}
                              disabled={isSaving}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="animate-spin" size={16} />
                                  Guardando...
                                </>
                              ) : (
                                <>
                                  <Save size={16} />
                                  Guardar cambios
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )})
                    ) : (
                      <p className="text-text-muted text-center py-4">
                        No hay ejercicios en esta rutina
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            );
          })
        )}
      </div>

      {/* Efecto confetti */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  )
}
