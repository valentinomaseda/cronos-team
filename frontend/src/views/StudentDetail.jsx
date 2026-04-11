import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Calendar, CheckCircle2, XCircle, Send, Plus, ChevronDown, ChevronUp, Info, X, Phone, Mail, Weight, Ruler, MapPin, Cake, Trash2, Edit2, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../context/AppContext'
import { personasAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import AchievementBadges from '../components/AchievementBadges'
import StreakDisplay from '../components/StreakDisplay'
import PersonalizeRoutine from '../components/PersonalizeRoutine'
import CustomSelect from '../components/CustomSelect'

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

export default function StudentDetail() {
  const { selectedStudent, setSelectedStudent, savedRoutines, assignRoutineToStudent, removeRoutineFromStudent, updateStudent, updateStudentRoutineStatus, showAlert, refreshStudents, user } = useAppContext()
  const navigate = useNavigate()
  const [selectedRoutineId, setSelectedRoutineId] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
  const [routineToDelete, setRoutineToDelete] = useState(null)
  const [deletingStudent, setDeletingStudent] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [updatingRoutineStatus, setUpdatingRoutineStatus] = useState(null)
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false)
  const [routineToPersonalize, setRoutineToPersonalize] = useState(null)
  const [editAssigned, setEditAssigned] = useState(false)
  const [assignedFecha, setAssignedFecha] = useState(null)
  const [expandedRoutine, setExpandedRoutine] = useState(null)
  const [assigningRoutine, setAssigningRoutine] = useState(false)
  const [deletingRoutine, setDeletingRoutine] = useState(false)
  const [updatingStudent, setUpdatingStudent] = useState(false)

  // Hacer scroll hacia arriba cuando se abre el modal de edición
  useEffect(() => {
    if (showEditModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showEditModal])

  // Función para formatear rutina como texto plano para WhatsApp
  const formatRoutineForWhatsApp = (routine) => {
    let text = `*${routine.name}*\n\n`
    
    routine.exercises.forEach((exercise, index) => {
      text += `${index + 1}. *${exercise.name}*\n`
      
      // Valor y unidad principal
      text += `   - ${exercise.value} ${getUnitName(exercise.unidad || exercise.type)}\n`
      
      // Series (solo para ejercicios de tipo 'reps')
      if ((exercise.unidad === 'reps' || exercise.type === 'reps') && exercise.sets) {
        text += `   - ${exercise.sets} ${exercise.sets === 1 ? 'serie' : 'series'}\n`
      }
      
      // Pausa entre series
      if (exercise.pausaSeries) {
        text += `   - Pausa entre series: ${exercise.pausaSeries}\n`
      }
      
      // Intensidad
      if (exercise.intensidad) {
        text += `   - Intensidad: ${exercise.intensidad}\n`
      }
      
      // Distancia
      if (exercise.distancia) {
        text += `   - Distancia: ${exercise.distancia}\n`
      }
      
      // Duración
      if (exercise.duracion) {
        text += `   - Duracion: ${exercise.duracion}\n`
      }
      
      // Descripción del intervalo
      if (exercise.descripcionIntervalo) {
        text += `   - Intervalo: ${exercise.descripcionIntervalo}\n`
      }
      
      // Especificaciones personalizadas
      if (exercise.especificaciones) {
        text += `   - Especificaciones: ${exercise.especificaciones}\n`
      }
      
      text += `\n`
    })
    
    text += '_Vamos con todo!_'
    return text
  }

  // Función para enviar por WhatsApp
  const handleSendWhatsApp = (routine) => {
    const formattedText = formatRoutineForWhatsApp(routine)
    const encodedText = encodeURIComponent(formattedText)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  // Función para asignar rutina (ahora abre modal de personalización)
  const handleAssignRoutine = () => {
    if (!selectedRoutineId) {
      showAlert('Por favor selecciona una rutina', 'warning')
      return
    }
    
    setAssigningRoutine(true)
    const routine = savedRoutines.find(r => r.id === parseInt(selectedRoutineId))
    if (routine) {
      setRoutineToPersonalize(routine)
      setShowPersonalizeModal(true)
    }
    setAssigningRoutine(false)
  }

  // Función para manejar después de guardar personalización
  const handlePersonalizeSave = async () => {
    // Recargar los estudiantes con sus rutinas actualizadas
    const alumnosActualizados = await refreshStudents()
    
    // Actualizar selectedStudent si existe
    if (selectedStudent) {
      const estudianteActualizado = alumnosActualizados.find(s => s.id === selectedStudent.id)
      if (estudianteActualizado) {
        setSelectedStudent(estudianteActualizado)
      }
    }
    
    setSelectedRoutineId('')
  }

  // Función para eliminar rutina
  const handleDeleteRoutine = async () => {
    if (routineToDelete) {
      setDeletingRoutine(true)
      try {
        await removeRoutineFromStudent(selectedStudent.id, routineToDelete.id, routineToDelete.fechaAsignacion)
        showAlert('Rutina eliminada exitosamente', 'success')
      } catch (error) {
        showAlert('Error al eliminar la rutina', 'error')
      } finally {
        setDeletingRoutine(false)
        setShowDeleteModal(false)
        setRoutineToDelete(null)
      }
    }
  }

  // Función para editar alumno
  const handleEditStudent = async (e) => {
    e.preventDefault()
    
    setUpdatingStudent(true)
    try {
      await updateStudent(selectedStudent.id, editFormData)
      setShowEditModal(false)
      showAlert('Alumno actualizado exitosamente', 'success')
    } catch (error) {
      showAlert(error.message || 'Error al actualizar el alumno', 'error')
    } finally {
      setUpdatingStudent(false)
    }
  }

  // Función para eliminar alumno
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return
    setDeletingStudent(true)
    try {
      await personasAPI.delete(selectedStudent.id)
      await refreshStudents()
      setSelectedStudent(null)
      showAlert('Alumno eliminado exitosamente', 'success')
      navigate('/alumnos')
    } catch (error) {
      console.error('Error eliminando alumno:', error)
      showAlert(error.message || 'Error al eliminar el alumno', 'error')
    } finally {
      setDeletingStudent(false)
      setShowDeleteStudentModal(false)
    }
  }

  // Función para actualizar estado de rutina
  const handleUpdateRoutineStatus = async (routineId, newStatus, fechaAsignacion) => {
    setUpdatingRoutineStatus(routineId)
    try {
      const updatedStudents = await updateStudentRoutineStatus(selectedStudent.id, routineId, newStatus, fechaAsignacion)
      
      // Actualizar el selectedStudent con los datos actualizados
      if (updatedStudents) {
        const updatedStudent = updatedStudents.find(s => s.id === selectedStudent.id)
        if (updatedStudent) {
          setSelectedStudent(updatedStudent)
        }
      }
    } catch (error) {
      console.error('Error updating routine status:', error)
      showAlert('Error al actualizar el estado de la rutina', 'error')
    } finally {
      setUpdatingRoutineStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'border-green-400'
      case 'incompleta':
        return 'border-yellow-400'
      case 'activa':
      default:
        return 'border-border'
    }
  }

  if (!selectedStudent) {
    return (
      <div className="p-4">
        <p className="text-center text-text-muted">No se ha seleccionado ningún alumno</p>
      </div>
    )
  }

  const handleBack = () => {
    setSelectedStudent(null)
    navigate('/alumnos')
  }

  // Preparar datos para el gráfico usando routineHistory con status
  const routinesWithStatus = selectedStudent.routineHistory || []
  
  // Calcular estadísticas
  const totalRoutines = routinesWithStatus.length
  const completedRoutines = routinesWithStatus.filter(r => r.status === 'completada').length
  const incompleteRoutines = routinesWithStatus.filter(r => r.status === 'incompleta').length
  
  const completionRate = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0

  // Datos para el gráfico de progreso basados en status real
  const chartData = routinesWithStatus
    .filter(r => r.status === 'completada' || r.status === 'incompleta')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((routine, index) => ({
      sesion: `S${index + 1}`,
      rendimiento: routine.status === 'completada' ? 100 : 50,
      fecha: routine.date
    }))

  // Último rendimiento
  const lastPerformance = chartData.length > 0 ? chartData[chartData.length - 1].rendimiento : 0
  
  // Promedio de rendimiento
  const averagePerformance = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.rendimiento, 0) / chartData.length)
    : 0

  // Calcular racha de días consecutivos
  const calculateStreak = () => {
    if (!routinesWithStatus || routinesWithStatus.length === 0) return { current: 0, longest: 0 }
    
    const sortedDates = routinesWithStatus
      .filter(r => r.status === 'completada')
      .map(r => new Date(r.date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a))
    
    const uniqueDates = [...new Set(sortedDates)]
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Verificar si entrenó hoy o ayer para racha actual
    const lastDate = uniqueDates[0] ? new Date(uniqueDates[0]) : null
    if (lastDate) {
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
      if (daysDiff <= 1) {
        currentStreak = 1
        // Calcular el resto de la racha
        for (let i = 1; i < uniqueDates.length; i++) {
          const prevDate = new Date(uniqueDates[i - 1])
          const currDate = new Date(uniqueDates[i])
          const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
          if (diff === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }
    
    // Calcular la racha más larga
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
      
      if (diff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak, uniqueDates.length > 0 ? 1 : 0)
    
    return { current: currentStreak, longest: longestStreak }
  }

  const streak = calculateStreak()

  // Estadísticas para logros
  const achievementStats = {
    completedRoutines,
    currentStreak: streak.current,
    completionRate,
    averagePerformance
  }

  return (
    <div className="page-shell space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 animate-slide-in-left">
        <button
          onClick={handleBack}
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-bg-surface border border-border text-brandBlue hover:bg-brandBlue/10 active:scale-95 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="title-section">Detalle del Alumno</h2>
      </div>

      {/* Card del alumno */}
      <div className="surface-panel p-6 animate-slide-in-up delay-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
          <img
            src={selectedStudent.photo}
            alt={selectedStudent.name}
            className="w-24 h-24 rounded-full border-4 border-border"
          />
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-text truncate">{selectedStudent.name}</h3>
              <p className="text-sm text-text-muted mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedStudent.level === 'Avanzado'
                    ? 'bg-success text-white'
                    : selectedStudent.level === 'Intermedio'
                    ? 'bg-brandBlue text-white'
                    : 'bg-brandBlue text-white'
                }`}
              >
                {selectedStudent.level}
              </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <button
              onClick={() => setShowInfoModal(true)}
              className="h-10 px-3 inline-flex items-center gap-2 bg-bg text-text rounded-lg border border-border hover:bg-bg-surface active:scale-95 transition-all"
              title="Ver información completa"
            >
              <Info size={18} strokeWidth={2.5} />
              Info
            </button>
            <button
              onClick={() => {
                setEditFormData({
                  nombre: selectedStudent.name,
                  telefono: selectedStudent.phone || '',
                  email: selectedStudent.email || '',
                  peso: selectedStudent.weight || '',
                  altura: selectedStudent.height || '',
                  domicilio: selectedStudent.address || '',
                  fechaNacimiento: selectedStudent.birthDate || '',
                  nivel: selectedStudent.level || 'Intermedio',
                  genero: selectedStudent.gender || 'masculino'
                })
                setShowEditModal(true)
              }}
              className="h-10 px-3 inline-flex items-center gap-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
              title="Editar alumno"
            >
              <Edit2 size={18} strokeWidth={2.5} />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de información del alumno */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-surface rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scale-in border border-border">
            <div className="flex-shrink-0 bg-brandBlue text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Información del Alumno</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 hover:bg-brandBlue rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-border">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.name}
                  className="w-20 h-20 rounded-full border-4 border-border"
                />
                <div>
                  <h4 className="text-xl font-bold text-text">{selectedStudent.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                    selectedStudent.level === 'Avanzado'
                      ? 'bg-success text-white'
                      : selectedStudent.level === 'Intermedio'
                      ? 'bg-brandBlue text-white'
                      : 'bg-brandBlue text-white'
                  }`}>
                    {selectedStudent.level}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                  <Phone className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-text-muted font-semibold">Teléfono</p>
                    <p className="text-text font-semibold">{selectedStudent.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                  <Mail className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-text-muted font-semibold">Email</p>
                    <p className="text-text font-semibold">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                  <MapPin className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-text-muted font-semibold">Dirección</p>
                    <p className="text-text font-semibold">{selectedStudent.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                  <Cake className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-text-muted font-semibold">Fecha de Nacimiento</p>
                    <p className="text-text font-semibold">{new Date(selectedStudent.birthDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                    <Weight className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                    <div>
                      <p className="text-xs text-text-muted font-semibold">Peso</p>
                      <p className="text-text font-bold">{selectedStudent.weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-bg rounded-lg border border-border">
                    <Ruler className="text-brandBlue mt-1" size={20} strokeWidth={2.5} />
                    <div>
                      <p className="text-xs text-text-muted font-semibold">Altura</p>
                      <p className="text-text font-bold">{selectedStudent.height} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asignar nueva rutina */}
      <div className="surface-brand p-6 animate-slide-in-up delay-200 relative z-20">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="text-brandBlue" size={20} />
          <h4 className="text-lg font-semibold text-text">Asignar Nueva Rutina</h4>
        </div>

        {savedRoutines.length === 0 ? (
          <p className="text-text text-center py-8">No hay rutinas guardadas. Crea una rutina en la sección "Rutinas".</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <CustomSelect
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
              options={[
                { value: '', label: 'Selecciona una rutina...' },
                ...savedRoutines.map(routine => ({
                  value: routine.id,
                  label: `${routine.name} (${routine.exercises.length} ejercicios)`
                }))
              ]}
              placeholder="Selecciona una rutina..."
              className="flex-1 text-lg"
            />
            <button
              onClick={handleAssignRoutine}
              disabled={assigningRoutine}
              className="px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {assigningRoutine ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Asignando...
                </>
              ) : (
                'Asignar'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Historial de rutinas */}
      <div className="surface-brand p-6 animate-slide-in-up delay-300">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="text-brandBlue" size={20} />
          <h4 className="text-lg font-semibold text-text">Historial de Rutinas</h4>
        </div>

        {selectedStudent.routineHistory.length === 0 ? (
          <p className="text-text text-center py-8">No hay rutinas asignadas aún</p>
        ) : (
          <div className="space-y-3">
            {selectedStudent.routineHistory.map((routine, index) => {
              // Crear un ID único que incluya la fecha de asignación
              const uniqueId = `${routine.id}-${routine.fechaAsignacion || routine.date}`;
              return (
              <div
                key={uniqueId}
                className={`bg-bg-surface rounded-xl border-2 ${getStatusColor(routine.status)} hover:border-brandBlue/40 transition-colors overflow-hidden shadow-sm`}
              >
                {/* Header de la rutina */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-text">{routine.name}</h5>
                      <p className="text-sm text-brandBlue mt-1">{routine.date}</p>
                      {routine.exercises && (
                        <p className="text-xs text-text mt-1">{routine.exercises.length} ejercicios</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {routine.exercises && (
                        <>
                          <button
                            onClick={() => setExpandedRoutine(expandedRoutine === uniqueId ? null : uniqueId)}
                            className="p-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
                            title="Ver ejercicios"
                          >
                            {expandedRoutine === uniqueId ? (
                              <ChevronUp size={20} strokeWidth={2.5} />
                            ) : (
                              <ChevronDown size={20} strokeWidth={2.5} />
                            )}
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(routine)}
                            className="p-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
                            title="Enviar por WhatsApp"
                          >
                            <Send size={20} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                      {user && (user.rol === 'profesora' || user.rol === 'coach') && (
                        <button
                          onClick={() => {
                            setRoutineToPersonalize(routine)
                            setAssignedFecha(routine.fechaAsignacion)
                            setEditAssigned(true)
                            setShowPersonalizeModal(true)
                          }}
                          className="p-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
                          title="Editar rutina asignada"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRoutineToDelete(routine)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all"
                        title="Eliminar rutina"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Estado actual */}
                  <div className="flex items-center justify-between p-2 bg-bg rounded-lg mb-3 border border-border/60">
                    <span className="text-text font-semibold text-sm">Estado:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      routine.status === 'completada' ? 'bg-success text-white' :
                      routine.status === 'incompleta' ? 'bg-primary text-white' :
                      'bg-bg text-text'
                    }`}>
                      {routine.status === 'completada' ? 'Completada' :
                       routine.status === 'incompleta' ? 'Incompleta' :
                       'Pendiente'}
                    </span>
                  </div>

                  {/* Botones de estado */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'completada', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'completada'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                        routine.status === 'completada'
                          ? 'bg-success text-white'
                          : 'bg-bg text-text hover:bg-success hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingRoutineStatus === routine.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        '✓'
                      )} Completada
                    </button>
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'incompleta', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'incompleta'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                        routine.status === 'incompleta'
                          ? 'bg-brandBlue text-white'
                          : 'bg-bg text-text hover:bg-brandBlue hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingRoutineStatus === routine.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        '◐'
                      )} Incompleta
                    </button>
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'activa', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'activa'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                        routine.status === 'activa'
                          ? 'bg-bg text-text'
                          : 'bg-bg text-text hover:bg-bg-surface hover:text-text'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingRoutineStatus === routine.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        '○'
                      )} Pendiente
                    </button>
                  </div>
                </div>

                {/* Detalles de ejercicios (expandible) */}
                {expandedRoutine === uniqueId && routine.exercises && (
                  <div className="border-t border-border p-4 bg-bg animate-slide-in-up">
                    <h4 className="text-lg font-bold text-brandBlue mb-4">
                      Ejercicios ({routine.exercises.length})
                    </h4>
                    <div className="space-y-3">
                      {routine.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="bg-bg-surface rounded-lg p-4 border border-border"
                        >
                          {/* Header del ejercicio con indicador de calentamiento */}
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-bold text-text flex items-center gap-2">
                              {idx + 1}. {exercise.name}
                              {exercise.esCalentamiento === 1 && (
                                <span className="text-xs px-2 py-1 bg-brandBlue text-white rounded-full">
                                  🔥 Calentamiento
                                </span>
                              )}
                            </h5>
                          </div>

                          {/* Información principal: Sets y Cantidad */}
                          <div className="flex flex-wrap gap-2 text-sm mb-3">
                            {/* Solo mostrar series para ejercicios de tipo 'reps' */}
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
                            <div className="mb-3 p-3 bg-bg rounded border border-border/60">
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
                            <div className="mt-2 p-3 bg-bg rounded border border-border/60">
                              <p className="text-sm text-brandBlue font-semibold mb-1">📝 Especificaciones personalizadas:</p>
                              <p className="text-sm text-text">{exercise.especificaciones}</p>
                            </div>
                          )}

                          {/* Estado del ejercicio y feedback del alumno */}
                          {(exercise.ejercicioCompletado !== undefined || exercise.feedbackAlumno) && (
                            <div className="mt-2 p-3 bg-bg rounded-lg border border-border/70">
                              {/* Indicador de completado */}
                              {exercise.ejercicioCompletado !== undefined && (
                                <div className="flex items-center gap-2 mb-2">
                                  {exercise.ejercicioCompletado ? (
                                    <>
                                      <CheckCircle2 className="text-success" size={20} />
                                      <span className="text-sm font-semibold text-success">✓ Completado por el alumno</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="text-text-muted" size={20} />
                                      <span className="text-sm font-semibold text-text-muted">Pendiente</span>
                                    </>
                                  )}
                                </div>
                              )}

                              {/* Feedback del alumno */}
                              {exercise.feedbackAlumno && (
                                <div className="mt-2 p-2 bg-bg rounded border border-border/70">
                                  <p className="text-xs text-brandBlue font-semibold mb-1 flex items-center gap-1">
                                    <span>💬</span> Comentario del alumno:
                                  </p>
                                  <p className="text-sm text-text italic">"{exercise.feedbackAlumno}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botón para mostrar progreso */}
      <div className="surface-brand p-6 animate-slide-in-up delay-400">
        <button
          onClick={() => setShowProgress(!showProgress)}
          className="w-full flex items-center justify-between px-4 py-3 bg-bg text-text rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} strokeWidth={2.5} />
            <span>Progreso Reciente</span>
          </div>
          {showProgress ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showProgress && (
          <div className="mt-6 space-y-6">
            {/* Gráfico de progreso */}
            {chartData.length > 0 ? (
              <div>
                <h4 className="text-sm font-bold text-text mb-3">Rendimiento en el Tiempo</h4>
                <div className="bg-bg-surface rounded-lg p-4 border border-border" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
            ) : (
              <div className="bg-bg-surface rounded-lg p-8 text-center border border-border">
                <TrendingUp className="mx-auto text-text-muted mb-3" size={48} />
                <p className="text-text font-semibold mb-2">No hay datos de progreso aún</p>
                <p className="text-sm text-text-muted">
                  El gráfico aparecerá cuando el alumno complete o marque rutinas como incompletas.
                </p>
              </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-bg-surface rounded-lg p-4 text-center border border-border">
                <p className="text-3xl font-bold text-brandBlue">
                  {lastPerformance}%
                </p>
                <p className="text-xs text-text mt-1">Último rendimiento</p>
              </div>
              <div className="bg-bg-surface rounded-lg p-4 text-center border border-border">
                <p className="text-3xl font-bold text-brandBlue">
                  {averagePerformance}%
                </p>
                <p className="text-xs text-text mt-1">Promedio</p>
              </div>
              <div className="bg-bg-surface rounded-lg p-4 text-center col-span-2 md:col-span-1 border border-border">
                <p className="text-3xl font-bold text-brandBlue">
                  {completedRoutines}
                </p>
                <p className="text-xs text-text mt-1">Rutinas completadas</p>
              </div>
            </div>

            {/* Resumen adicional */}
            <div className="bg-bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-text">Tasa de Completado</h4>
                <span className="text-2xl font-bold text-brandBlue">{completionRate}%</span>
              </div>
              <div className="w-full bg-bg rounded-full h-3 overflow-hidden border border-border/60">
                <div
                  className="bg-brandBlue h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-text-muted mt-2">
                {completedRoutines} de {totalRoutines} rutinas completadas
                {incompleteRoutines > 0 && ` · ${incompleteRoutines} incompletas`}
              </p>
            </div>

            {/* Racha de entrenamiento */}
            <div className="mt-6">
              <StreakDisplay currentStreak={streak.current} longestStreak={streak.longest} />
            </div>

            {/* Sistema de logros */}
            <div className="mt-6 bg-bg-surface rounded-lg p-4 border border-border">
              <AchievementBadges stats={achievementStats} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-surface rounded-xl shadow-2xl max-w-md w-full animate-scale-in border border-border">
            <div className="sticky top-0 bg-brandBlue text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Confirmar Eliminación</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setRoutineToDelete(null)
                }}
                className="p-2 hover:bg-brandBlue rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-text">
                ¿Estás seguro que deseas eliminar la rutina <strong className="text-brandBlue">{routineToDelete?.name}</strong>?
              </p>
              <p className="text-sm text-text-muted">Esta acción no se puede deshacer.</p>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setRoutineToDelete(null)
                  }}
                  disabled={deletingRoutine}
                  className="flex-1 px-4 py-3 bg-bg text-text rounded-lg hover:bg-bg-surface active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteRoutine}
                  disabled={deletingRoutine}
                  className="flex-1 px-4 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingRoutine ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de alumno */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-bg-surface rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scale-in border border-border my-8">
            <div className="flex-shrink-0 bg-brandBlue text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Editar Alumno</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-brandBlue rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleEditStudent} className="p-6 space-y-4">
                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={editFormData.nombre || ''}
                    onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                    className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Nivel</label>
                  <CustomSelect
                    value={editFormData.nivel || 'Intermedio'}
                    onChange={(e) => setEditFormData({...editFormData, nivel: e.target.value})}
                    options={[
                      { value: 'Principiante', label: 'Principiante' },
                      { value: 'Intermedio', label: 'Intermedio' },
                      { value: 'Avanzado', label: 'Avanzado' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Género</label>
                  <CustomSelect
                    value={editFormData.genero || 'masculino'}
                    onChange={(e) => setEditFormData({...editFormData, genero: e.target.value})}
                    options={[
                      { value: 'masculino', label: 'Masculino' },
                      { value: 'femenino', label: 'Femenino' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={editFormData.telefono || ''}
                    onChange={(e) => setEditFormData({...editFormData, telefono: e.target.value})}
                    className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-brandBlue font-semibold mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editFormData.peso || ''}
                      onChange={(e) => setEditFormData({...editFormData, peso: e.target.value})}
                      className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-brandBlue font-semibold mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={editFormData.altura || ''}
                      onChange={(e) => setEditFormData({...editFormData, altura: e.target.value})}
                      className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Domicilio</label>
                  <input
                    type="text"
                    value={editFormData.domicilio || ''}
                    onChange={(e) => setEditFormData({...editFormData, domicilio: e.target.value})}
                    className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brandBlue font-semibold mb-2">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={editFormData.fechaNacimiento || ''}
                    onChange={(e) => setEditFormData({...editFormData, fechaNacimiento: e.target.value})}
                    className="w-full px-4 py-3 bg-bg text-text border-2 border-border rounded-lg focus:border-border focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={updatingStudent}
                    className="flex-1 px-4 py-3 bg-bg text-text rounded-lg hover:bg-bg-surface active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStudent}
                    className="flex-1 px-4 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updatingStudent ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
                {/* Botón de eliminar alumno - opción al final del modal de edición */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteStudentModal(true)}
                    className="w-full px-4 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Eliminar alumno
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar alumno */}
      {showDeleteStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-surface rounded-xl shadow-2xl max-w-md w-full animate-scale-in border border-border">
            <div className="sticky top-0 bg-brandBlue text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Eliminar Alumno</h3>
              <button
                onClick={() => setShowDeleteStudentModal(false)}
                className="p-2 hover:bg-brandBlue rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-text">
                ¿Estás seguro que deseas eliminar al alumno <strong className="text-brandBlue">{selectedStudent.name}</strong>? Esta acción no se puede deshacer.
              </p>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteStudentModal(false)}
                  disabled={deletingStudent}
                  className="flex-1 px-4 py-3 bg-bg text-text rounded-lg hover:bg-bg-surface active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteStudent}
                  disabled={deletingStudent}
                  className="flex-1 px-4 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue hover:text-white active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingStudent ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar alumno'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de personalización de rutina */}
      {showPersonalizeModal && routineToPersonalize && (
        <PersonalizeRoutine
          routine={routineToPersonalize}
          student={selectedStudent}
          assigned={editAssigned}
          fechaAsignacion={assignedFecha}
          onClose={() => {
            setShowPersonalizeModal(false)
            setRoutineToPersonalize(null)
            setEditAssigned(false)
            setAssignedFecha(null)
          }}
          onSave={handlePersonalizeSave}
          showAlert={showAlert}
        />
      )}
    </div>
  )
}

