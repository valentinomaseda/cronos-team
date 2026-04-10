import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { personasAPI, ejerciciosAPI, rutinasAPI } from '../services/api'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { mockStudents, mockExercises, mockSavedRoutines, mockMyRoutines } from '../mocks/uiMockData'

const AppContext = createContext()
const USE_UI_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

// Helper para transformar datos del backend al formato del frontend
const transformPersonaToStudent = (persona) => {
  // Generar avatar basado en género usando siluetas simples
  const genero = persona.genero && (persona.genero === 'femenino' || persona.genero === 'masculino') 
    ? persona.genero 
    : 'masculino'
  
  // Usar imágenes reales para los avatares
  const avatarUrl = genero === 'femenino' ? '/avatar-fem.jpg' : '/avatar-masc.jpg'
  
  return {
    id: persona.idPersona,
    name: persona.nombre,
    photo: avatarUrl,
    level: persona.nivel || 'Intermedio',
    gender: genero,
    phone: persona.tel?.toString() || '',
    email: persona.mail,
    weight: persona.peso,
    height: persona.altura,
    address: persona.direccion || '',
    birthDate: persona.fechaNac ? new Date(persona.fechaNac).toISOString().split('T')[0] : '',
    progress: [],
    routineHistory: []
  }
}

// Helper para generar URL de avatar basado en ID y género
const generateAvatarUrl = (idPersona, genero) => {
  // Asegurar que siempre haya un género válido
  const validGenero = genero && (genero === 'femenino' || genero === 'masculino') 
    ? genero 
    : 'masculino'
  
  // Usar imágenes reales para los avatares
  return validGenero === 'femenino' ? '/avatar-fem.jpg' : '/avatar-masc.jpg'
}

// Helper para agregar avatar a un usuario
const addAvatarToUser = (user) => {
  if (!user) return null
  return {
    ...user,
    photo: generateAvatarUrl(user.idPersona, user.genero || 'masculino'),
    // Asegurar que direccion esté disponible como domicilio también
    domicilio: user.direccion || user.domicilio || '',
    // Asegurar que fechaNacimiento esté disponible desde fechaNac
    fechaNacimiento: user.fechaNac || user.fechaNacimiento || ''
  }
}

const transformEjercicioToExercise = (ejercicio) => {
  return {
    id: ejercicio.idEjercicio,
    name: ejercicio.nombre,
    defaultType: ejercicio.unidad || ejercicio.tipoContador || 'reps',
    unidad: ejercicio.unidad || ejercicio.tipoContador || 'reps',
    distancia: ejercicio.distancia || null,
    duracion: ejercicio.duracion || null,
    descripcionIntervalo: ejercicio.descripcionIntervalo || null
  }
}

const transformRutinaToRoutine = (rutina, ejercicios = []) => {
  return {
    id: rutina.idRutina,
    name: rutina.nombre,
    createdAt: rutina.fechaHoraCreacion,
    exercises: ejercicios.map(ej => {
      // Los datos de sets y cantidad ahora vienen de rutina_ejercicio
      return {
        exerciseId: ej.idEjercicio,
        id: ej.idEjercicio,
        name: ej.nombre,
        sets: ej.cantSets || 3,
        value: ej.cantidad || 10,
        type: ej.unidad || ej.tipoContador || 'reps',
        unidad: ej.unidad || ej.tipoContador || 'reps',
        distancia: ej.distancia || null,
        duracion: ej.duracion || null,
        descripcionIntervalo: ej.descripcionIntervalo || null
      }
    })
  }
}

export const AppProvider = ({ children }) => {
  // Estado de autenticación
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Estados de datos
  const [students, setStudents] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [savedRoutines, setSavedRoutines] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Estados para alumno
  const [myRoutines, setMyRoutines] = useState([])
  const [pendingEmailData, setPendingEmailData] = useState({ email: '', nombre: '' }) // Para almacenar datos cuando email no está verificado
  const [navigationCallback, setNavigationCallback] = useState(null) // Callback para navegación

  // Ref para mantener referencia actualizada de myRoutines sin causar re-renders
  const myRoutinesRef = useRef([])

  // Estado para toast notifications
  const [toastState, setToastState] = useState({
    isOpen: false,
    message: '',
    type: 'info'
  })

  // Estado para modal global (solo para confirmaciones)
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    buttons: []
  })

  // Función para mostrar toast (para alertas simples)
  const showAlert = (message, type = 'info', title = null) => {
    setToastState({
      isOpen: true,
      message,
      type
    })
  }

  const closeToast = () => {
    setToastState({
      isOpen: false,
      message: '',
      type: 'info'
    })
  }

  // Función para mostrar modal de confirmación
  const showConfirm = (message, onConfirm, title = '¿Estás seguro?') => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: 'warning',
      buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: () => closeModal()
        },
        {
          label: 'Confirmar',
          variant: 'primary',
          onClick: () => {
            closeModal()
            onConfirm()
          }
        }
      ]
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
      buttons: []
    })
  }

  const loadMockDataByRole = (currentUser) => {
    if (currentUser?.rol === 'alumno') {
      setMyRoutines(mockMyRoutines)
      return
    }
    setStudents(mockStudents)
    setExercises(mockExercises)
    setSavedRoutines(mockSavedRoutines)
  }

  // Cargar datos del usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        const userWithAvatar = addAvatarToUser(userData)
        setUser(userWithAvatar)
        setIsAuthenticated(true)
        loadData(userWithAvatar)
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Polling automático para actualizar rutinas (solo para alumnos)
  useEffect(() => {
    // Solo activar polling si el usuario es alumno y está autenticado
    if (!user || user.rol !== 'alumno' || !isAuthenticated) {
      return
    }

    // Intervalo de actualización: 30 segundos
    const POLLING_INTERVAL = 30000 // 30 segundos

    let intervalId = null
    let isTabVisible = !document.hidden
    let isFirstCheck = true // Para evitar notificar en la primera verificación

    // Función mejorada para verificar y actualizar rutinas
    const checkForUpdates = async () => {
      // Solo actualizar si la pestaña está visible
      if (!isTabVisible || !user) return

      try {
        const rutinas = await personasAPI.getRutinas(user.idPersona)
        
        // Crear un mapa de rutinas actuales para comparación eficiente
        const currentRoutinesMap = new Map(
          myRoutinesRef.current.map(r => [
            `${r.id}-${r.fechaAsignacion}`, 
            { estado: r.status, nombre: r.name }
          ])
        )
        
        // Verificar si hay cambios reales
        let hasNewRoutine = false
        let hasStatusChange = false
        
        for (const rutina of rutinas) {
          const key = `${rutina.idRutina}-${rutina.fechaAsignacion}`
          const existing = currentRoutinesMap.get(key)
          
          if (!existing) {
            hasNewRoutine = true
            break
          }
          
          if (existing.estado !== rutina.estado) {
            hasStatusChange = true
            break
          }
        }
        
        // También verificar si se eliminó alguna rutina
        const hasRemovedRoutine = rutinas.length < myRoutinesRef.current.length

        const hasChanges = hasNewRoutine || hasStatusChange || hasRemovedRoutine

        // Si hay cambios, recargar las rutinas completas
        if (hasChanges) {
          console.log('[Auto-update] ¡Cambios detectados! Recargando rutinas...')
          await loadMyRoutines(user)
          
          // Solo notificar si no es la primera verificación
          if (!isFirstCheck) {
            if (hasNewRoutine) {
              showAlert('¡Te han asignado una nueva rutina!', 'success')
            } else if (hasStatusChange) {
              showAlert('Se actualizó el estado de tus rutinas', 'info')
            } else if (hasRemovedRoutine) {
              showAlert('Se actualizaron tus rutinas', 'info')
            }
          }
        }
        
        // Marcar que ya no es la primera verificación
        isFirstCheck = false
        
      } catch (error) {
        console.error('[Auto-update] Error verificando actualizaciones:', error)
        // No mostrar error al usuario para no interrumpir la experiencia
      }
    }

    // Manejar cambios de visibilidad de la pestaña
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden
      
      // Si la pestaña se vuelve visible, verificar actualizaciones inmediatamente
      if (isTabVisible) {
        console.log('[Auto-update] Pestaña activa, verificando actualizaciones...')
        checkForUpdates()
      }
    }

    // Manejar evento focus de la ventana
    const handleWindowFocus = () => {
      console.log('[Auto-update] Ventana enfocada, verificando actualizaciones...')
      checkForUpdates()
    }

    // Configurar el polling
    intervalId = setInterval(checkForUpdates, POLLING_INTERVAL)

    // Escuchar cambios de visibilidad y focus
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)

    console.log('[Auto-update] Sistema de actualización automática activado')

    // Limpiar al desmontar o cuando cambie el usuario
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        console.log('[Auto-update] Sistema de actualización automática desactivado')
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [user, isAuthenticated]) // Removido myRoutines de las dependencias

  // Mantener la referencia de myRoutines actualizada
  useEffect(() => {
    myRoutinesRef.current = myRoutines
  }, [myRoutines])

  // Cargar datos del backend
  const loadData = async (currentUser = null) => {
    setLoading(true)
    const userData = currentUser || user

    if (USE_UI_MOCKS) {
      loadMockDataByRole(userData)
      setLoading(false)
      return
    }

    try {
      // Usar el usuario proporcionado o el del estado
      const userData = currentUser || user
      
      // Si es alumno, solo cargar sus rutinas
      if (userData && userData.rol === 'alumno') {
        await loadMyRoutines(userData)
        setLoading(false)
        return
      }
      
      // Si es coach, cargar todos los datos
      // Cargar alumnos
      const alumnos = await personasAPI.getByRol('alumno')
      if (!alumnos || alumnos.length === 0) {
        loadMockDataByRole(userData)
        setLoading(false)
        return
      }
      
      // Cargar rutinas asignadas de cada alumno
      const alumnosConRutinas = await Promise.all(
        alumnos.map(async (alumno) => {
          try {
            const rutinasAsignadas = await personasAPI.getRutinas(alumno.idPersona)
            const studentData = transformPersonaToStudent(alumno)
            
            // Transformar rutinas asignadas al formato del frontend con ejercicios
            studentData.routineHistory = await Promise.all(
              rutinasAsignadas.map(async (ra) => {
                try {
                  // Cargar ejercicios de esta rutina
                  const ejercicios = await rutinasAPI.getEjercicios(ra.idRutina)
                  
                  return {
                    id: ra.idRutina,
                    name: ra.nombre,
                    date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    fechaAsignacion: ra.fechaAsignacion,
                    status: ra.estado || 'activa',
                    completed: ra.estado === 'completada',
                    exercises: ejercicios.map(ej => ({
                      exerciseId: ej.idEjercicio,
                      id: ej.idEjercicio,
                      name: ej.nombre,
                      sets: ej.cantSets || 3,
                      value: ej.cantidad || 10,
                      type: ej.unidad || ej.tipoContador || 'reps',
                      unidad: ej.unidad || ej.tipoContador || 'reps',
                      distancia: ej.distancia || null,
                      duracion: ej.duracion || null,
                      descripcionIntervalo: ej.descripcionIntervalo || null
                    }))
                  }
                } catch (error) {
                  console.error(`Error loading exercises for routine ${ra.idRutina}:`, error)
                  return {
                    id: ra.idRutina,
                    name: ra.nombre,
                    date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    fechaAsignacion: ra.fechaAsignacion,
                    status: ra.estado || 'activa',
                    completed: ra.estado === 'completada',
                    exercises: []
                  }
                }
              })
            )
            
            return studentData
          } catch (error) {
            console.error(`Error loading routines for student ${alumno.idPersona}:`, error)
            return transformPersonaToStudent(alumno)
          }
        })
      )
      setStudents(alumnosConRutinas)

      // Cargar ejercicios
      const ejercicios = await ejerciciosAPI.getAll()
      setExercises(ejercicios.map(transformEjercicioToExercise))

      // Cargar rutinas con sus ejercicios
      const rutinas = await rutinasAPI.getAll()
      const rutinasConEjercicios = await Promise.all(
        rutinas.map(async (rutina) => {
          try {
            const ejercicios = await rutinasAPI.getEjercicios(rutina.idRutina)
            return transformRutinaToRoutine(rutina, ejercicios)
          } catch (error) {
            console.error(`Error loading exercises for routine ${rutina.idRutina}:`, error)
            return transformRutinaToRoutine(rutina, [])
          }
        })
      )
      setSavedRoutines(rutinasConEjercicios)
    } catch (error) {
      console.error('Error loading data:', error)
      loadMockDataByRole(userData)

    } finally {
      setLoading(false)
    }
  }

  // Función de login
  const login = async (email, password) => {
    // TEMPORARY: demo bypass to allow showing UI without backend
    // Use credentials demo / demo to skip backend during prototyping.
    if (email === 'demo@gmail.com' && password === 'demo') {
      const demoPersona = {
        idPersona: 0,
        nombre: 'Demo User',
        rol: 'profesora'
      }
      const userWithAvatar = addAvatarToUser(demoPersona)
      setUser(userWithAvatar)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userWithAvatar))
      await loadData(userWithAvatar)
      return
    }
        if (email === 'demoal@gmail.com' && password === 'demo') {
      const demoPersona = {
        idPersona: 0,
        nombre: 'Demo User',
        rol: 'alumno'
      }
      const userWithAvatar = addAvatarToUser(demoPersona)
      setUser(userWithAvatar)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userWithAvatar))
      await loadData(userWithAvatar)
      return
    }
    try {
      const persona = await personasAPI.login(email, password)
      
      // Agregar avatar al usuario
      const userWithAvatar = addAvatarToUser(persona)
      
      // Guardar usuario en estado y localStorage
      setUser(userWithAvatar)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userWithAvatar))
      
      // Cargar datos pasando el usuario explícitamente
      await loadData(userWithAvatar)
    } catch (error) {
      // Si el error es por email no verificado, cambiar a vista de verificación pendiente
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        setPendingEmailData({ email: error.email, nombre: error.nombre })
        // Navegar a pending-verification usando el callback
        if (navigationCallback) {
          navigationCallback('/pending-verification')
        }
        throw new Error('Por favor verifica tu email antes de iniciar sesión')
      }
      throw error
    }
  }

  // Función de logout
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    setStudents([])
    setExercises([])
    setSavedRoutines([])
    setSelectedStudent(null)
  }

  // Función para refrescar alumnos
  const refreshStudents = async () => {
    try {
      const alumnos = await personasAPI.getByRol('alumno')
      
      // Cargar rutinas asignadas de cada alumno
      const alumnosConRutinas = await Promise.all(
        alumnos.map(async (alumno) => {
          try {
            const rutinasAsignadas = await personasAPI.getRutinas(alumno.idPersona)
            const studentData = transformPersonaToStudent(alumno)
            
            // Transformar rutinas asignadas al formato del frontend con ejercicios
            studentData.routineHistory = await Promise.all(
              rutinasAsignadas.map(async (ra) => {
                try {
                  // Cargar ejercicios personalizados de esta rutina para este alumno
                  const ejercicios = await rutinasAPI.getAlumnoEjercicios(
                    ra.idRutina,
                    alumno.idPersona,
                    ra.fechaAsignacion
                  )
                  
                  return {
                    id: ra.idRutina,
                    name: ra.nombre,
                    date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    fechaAsignacion: ra.fechaAsignacion,
                    status: ra.estado || 'activa',
                    completed: ra.estado === 'completada',
                    exercises: ejercicios.map(ej => ({
                      exerciseId: ej.idEjercicio,
                      id: ej.idEjercicio,
                      name: ej.nombre,
                      sets: ej.cantSets || 3,
                      value: ej.cantidad || 10,
                      type: ej.unidad || ej.tipoContador || 'reps',
                      unidad: ej.unidad || ej.tipoContador || 'reps',
                      distancia: ej.distancia || null,
                      duracion: ej.duracion || null,
                      descripcionIntervalo: ej.descripcionIntervalo || null,
                      pausaSeries: ej.pausaSeries || null,
                      intensidad: ej.intensidad || null,
                      especificaciones: ej.especificaciones || null,
                      esCalentamiento: ej.esCalentamiento || false,
                      ejercicioCompletado: ej.ejercicioCompletado || false,
                      feedbackAlumno: ej.feedbackAlumno || '',
                      orden: ej.orden
                    }))
                  }
                } catch (error) {
                  console.error(`Error loading exercises for routine ${ra.idRutina}:`, error)
                  return {
                    id: ra.idRutina,
                    name: ra.nombre,
                    date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    fechaAsignacion: ra.fechaAsignacion,
                    status: ra.estado || 'activa',
                    completed: ra.estado === 'completada',
                    exercises: []
                  }
                }
              })
            )
            
            return studentData
          } catch (error) {
            console.error(`Error loading routines for student ${alumno.idPersona}:`, error)
            return transformPersonaToStudent(alumno)
          }
        })
      )
      setStudents(alumnosConRutinas)
      return alumnosConRutinas
    } catch (error) {
      console.error('Error refreshing students:', error)
      throw error
    }
  }

  // Función para refrescar ejercicios
  const refreshExercises = async () => {
    try {
      const ejercicios = await ejerciciosAPI.getAll()
      setExercises(ejercicios.map(transformEjercicioToExercise))
    } catch (error) {
      console.error('Error refreshing exercises:', error)
      throw error
    }
  }

  // Función para cargar detalles completos de un alumno específico
  const loadStudentDetails = async (idPersona) => {
    if (USE_UI_MOCKS) {
      const mockStudent = mockStudents.find((s) => s.idPersona === Number(idPersona))
      if (mockStudent) return mockStudent
    }

    try {
      const alumno = await personasAPI.getById(idPersona)
      if (!alumno) {
        throw new Error('Alumno no encontrado')
      }

      const rutinasAsignadas = await personasAPI.getRutinas(idPersona)
      const studentData = transformPersonaToStudent(alumno)
      
      // Transformar rutinas asignadas al formato del frontend con ejercicios
      studentData.routineHistory = await Promise.all(
        rutinasAsignadas.map(async (ra) => {
          try {
            // Cargar ejercicios personalizados de esta rutina para este alumno
            const ejercicios = await rutinasAPI.getAlumnoEjercicios(
              ra.idRutina, 
              idPersona, 
              ra.fechaAsignacion
            )
            
            return {
              id: ra.idRutina,
              name: ra.nombre,
              date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              fechaAsignacion: ra.fechaAsignacion,
              status: ra.estado || 'activa',
              completed: ra.estado === 'completada',
              exercises: ejercicios.map(ej => ({
                exerciseId: ej.idEjercicio,
                id: ej.idEjercicio,
                name: ej.nombre,
                sets: ej.cantSets || 3,
                value: ej.cantidad || 10,
                type: ej.unidad || ej.tipoContador || 'reps',
                unidad: ej.unidad || ej.tipoContador || 'reps',
                // Campos adicionales para personalizaciones
                distancia: ej.distancia,
                duracion: ej.duracion,
                descripcionIntervalo: ej.descripcionIntervalo,
                pausaSeries: ej.pausaSeries,
                intensidad: ej.intensidad,
                especificaciones: ej.especificaciones,
                esCalentamiento: ej.esCalentamiento,
                // Campos para el alumno
                ejercicioCompletado: ej.ejercicioCompletado || false,
                feedbackAlumno: ej.feedbackAlumno || '',
                orden: ej.orden
              }))
            }
          } catch (error) {
            console.error(`Error loading exercises for routine ${ra.idRutina}:`, error)
            return {
              id: ra.idRutina,
              name: ra.nombre,
              date: ra.fechaAsignacion ? new Date(ra.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              fechaAsignacion: ra.fechaAsignacion,
              status: ra.estado || 'activa',
              completed: ra.estado === 'completada',
              exercises: []
            }
          }
        })
      )
      
      return studentData
    } catch (error) {
      console.error('Error loading student details:', error)
      const mockStudent = mockStudents.find((s) => s.idPersona === Number(idPersona))
      if (mockStudent) {
        return mockStudent
      }
      throw error
    }
  }

  // Función para añadir nuevo alumno
  const addStudent = async (studentData) => {
    try {
      // Obtener todas las personas para generar un ID único que no colisione
      const todasPersonas = await personasAPI.getAll()
      const newId = Math.max(0, ...todasPersonas.map(p => p.idPersona)) + 1
      
      const personaData = {
        idPersona: newId,
        nombre: studentData.name,
        mail: studentData.email,
        tel: studentData.phone || '',  // Enviar como string, no como número
        rol: 'alumno',
        nivel: studentData.level || 'Intermedio',
        genero: studentData.gender || 'masculino',
        direccion: studentData.address || '',
        fechaNac: studentData.birthDate || null,
        peso: parseFloat(studentData.weight) || null,
        altura: parseFloat(studentData.height) || null,
        // No se envía password - el profesor registra alumnos sin contraseña
        activo: true // Por defecto todos los alumnos nuevos están activos
      }

      await personasAPI.create(personaData)
      await refreshStudents()
    } catch (error) {
      console.error('Error adding student:', error)
      throw error
    }
  }

  // Función para añadir nuevo ejercicio
  const addExercise = async (exerciseData) => {
    try {
      // Obtener todos los ejercicios para generar un ID único
      const todosEjercicios = await ejerciciosAPI.getAll()
      const newId = Math.max(0, ...todosEjercicios.map(e => e.idEjercicio)) + 1
      
      const ejercicioData = {
        idEjercicio: newId,
        nombre: exerciseData.name,
        unidad: exerciseData.unidad || 'reps',
        distancia: exerciseData.distancia || null,
        duracion: exerciseData.duracion || null,
        descripcionIntervalo: exerciseData.descripcionIntervalo || null
      }

      await ejerciciosAPI.create(ejercicioData)
      await refreshExercises()
    } catch (error) {
      console.error('Error adding exercise:', error)
      throw error
    }
  }

  // Función para guardar rutina
  const saveRoutine = async (routine) => {
    try {
      // Obtener todas las rutinas para generar un ID único
      const todasRutinas = await rutinasAPI.getAll()
      const newId = Math.max(0, ...todasRutinas.map(r => r.idRutina)) + 1
      
      const rutinaData = {
        idRutina: newId,
        nombre: routine.name,
        descripcion: routine.description || '',
        nivel: routine.level || 'Intermedio'
      }

      await rutinasAPI.create(rutinaData)
      
      // Agregar ejercicios a la rutina con sus sets y cantidad
      if (routine.exercises && routine.exercises.length > 0) {
        for (let i = 0; i < routine.exercises.length; i++) {
          const exercise = routine.exercises[i]
          const ejercicioData = {
            idEjercicio: exercise.exerciseId || exercise.id,
            cantSets: exercise.sets || 3,
            cantidad: exercise.value || 10,
            orden: i + 1
          }
          await rutinasAPI.addEjercicio(newId, ejercicioData)
        }
      }

      // Recargar todas las rutinas desde el backend con ejercicios
      const rutinas = await rutinasAPI.getAll()
      const rutinasConEjercicios = await Promise.all(
        rutinas.map(async (rutina) => {
          try {
            const ejercicios = await rutinasAPI.getEjercicios(rutina.idRutina)
            return transformRutinaToRoutine(rutina, ejercicios)
          } catch (error) {
            console.error(`Error loading exercises for routine ${rutina.idRutina}:`, error)
            return transformRutinaToRoutine(rutina, [])
          }
        })
      )
      setSavedRoutines(rutinasConEjercicios)
      
      return { id: newId, ...rutinaData }
    } catch (error) {
      console.error('Error saving routine:', error)
      throw error
    }
  }

  // Función para actualizar una rutina existente (incluye reemplazo de ejercicios)
  const updateRoutine = async (routineId, routine) => {
    try {
      // Preparar payload: enviar nombre y arreglo de ejercicios con campos esperados
      const payload = {
        nombre: routine.name,
        exercises: (routine.exercises || []).map((ex, i) => ({
          idEjercicio: ex.exerciseId || ex.id,
          cantSets: ex.sets || ex.cantSets || 3,
          cantidad: ex.value || ex.cantidad || 10,
          orden: ex.orden || i + 1,
          pausaSeries: ex.pausaSeries || null,
          intensidad: ex.intensidad || null,
          esCalentamiento: ex.esCalentamiento || false
        }))
      }

      await rutinasAPI.update(routineId, payload)

      // Recargar todas las rutinas desde el backend con ejercicios
      const rutinas = await rutinasAPI.getAll()
      const rutinasConEjercicios = await Promise.all(
        rutinas.map(async (rutina) => {
          try {
            const ejercicios = await rutinasAPI.getEjercicios(rutina.idRutina)
            return transformRutinaToRoutine(rutina, ejercicios)
          } catch (error) {
            console.error(`Error loading exercises for routine ${rutina.idRutina}:`, error)
            return transformRutinaToRoutine(rutina, [])
          }
        })
      )
      setSavedRoutines(rutinasConEjercicios)

      return true
    } catch (error) {
      console.error('Error updating routine:', error)
      throw error
    }
  }

  // Función para eliminar rutina
  const deleteRoutine = async (routineId) => {
    try {
      await rutinasAPI.delete(routineId)
      
      // Recargar todas las rutinas desde el backend
      const rutinas = await rutinasAPI.getAll()
      const rutinasConEjercicios = await Promise.all(
        rutinas.map(async (rutina) => {
          try {
            const ejercicios = await rutinasAPI.getEjercicios(rutina.idRutina)
            return transformRutinaToRoutine(rutina, ejercicios)
          } catch (error) {
            console.error(`Error loading exercises for routine ${rutina.idRutina}:`, error)
            return transformRutinaToRoutine(rutina, [])
          }
        })
      )
      setSavedRoutines(rutinasConEjercicios)
    } catch (error) {
      console.error('Error deleting routine:', error)
      throw error
    }
  }

  // Función para asignar rutina a alumno
  const assignRoutineToStudent = async (studentId, routine) => {
    try {
      await rutinasAPI.assignToPersona(routine.idRutina || routine.id, studentId)
      
      // Recargar los estudiantes con sus rutinas actualizadas desde la base de datos
      const alumnosActualizados = await refreshStudents()
      
      // Actualizar selectedStudent si existe
      if (selectedStudent && selectedStudent.id === studentId) {
        const estudianteActualizado = alumnosActualizados.find(s => s.id === studentId)
        if (estudianteActualizado) {
          setSelectedStudent(estudianteActualizado)
        }
      }
    } catch (error) {
      console.error('Error assigning routine:', error)
      throw error
    }
  }

  // Función para eliminar rutina de alumno
  const removeRoutineFromStudent = async (studentId, routineId, fechaAsignacion = null) => {
    try {
      await rutinasAPI.removeFromPersona(routineId, studentId, fechaAsignacion)
      
      // Recargar los estudiantes con sus rutinas actualizadas desde la base de datos
      const alumnosActualizados = await refreshStudents()
      
      // Actualizar selectedStudent si existe
      if (selectedStudent && selectedStudent.id === studentId) {
        const estudianteActualizado = alumnosActualizados.find(s => s.id === studentId)
        if (estudianteActualizado) {
          setSelectedStudent(estudianteActualizado)
        }
      }
    } catch (error) {
      console.error('Error removing routine:', error)
      throw error
    }
  }

  // Función para actualizar alumno
  const updateStudent = async (studentId, studentData) => {
    try {
      // Mapear campos del frontend a campos de la base de datos
      const personaData = {
        nombre: studentData.nombre,
        mail: studentData.email,
        tel: studentData.telefono || '',
        nivel: studentData.nivel,
        genero: studentData.genero,
        direccion: studentData.domicilio || '',
        fechaNac: studentData.fechaNacimiento || null,
        peso: parseFloat(studentData.peso) || null,
        altura: parseFloat(studentData.altura) || null
      }
      
      await personasAPI.update(studentId, personaData)
      
      // Recargar los estudiantes con los datos actualizados desde la base de datos
      const alumnosActualizados = await refreshStudents()
      
      // Actualizar selectedStudent si existe
      if (selectedStudent && selectedStudent.id === studentId) {
        const estudianteActualizado = alumnosActualizados.find(s => s.id === studentId)
        if (estudianteActualizado) {
          setSelectedStudent(estudianteActualizado)
        }
      }
    } catch (error) {
      console.error('Error updating student:', error)
      throw error
    }
  }

  // Función para actualizar perfil del usuario
  const updateProfile = async (profileData) => {
    try {
      // Mapear campos del frontend a campos de la base de datos
      const dataToUpdate = {
        nombre: profileData.nombre,
        mail: profileData.mail,
        tel: profileData.tel || '',
        genero: profileData.genero,
        direccion: profileData.domicilio || '',
        fechaNac: profileData.fechaNacimiento || null,
        peso: parseFloat(profileData.peso) || null,
        altura: parseFloat(profileData.altura) || null
      }
      
      // Si se está cambiando la contraseña, validar y agregar campos
      if (profileData.newPassword && profileData.newPassword.trim() !== '') {
        dataToUpdate.currentPassword = profileData.currentPassword
        dataToUpdate.newPassword = profileData.newPassword
      }
      
      await personasAPI.update(user.idPersona, dataToUpdate)
      
      // Recargar datos del usuario y agregar avatar
      const updatedUser = await personasAPI.getById(user.idPersona)
      const userWithAvatar = addAvatarToUser(updatedUser)
      setUser(userWithAvatar)
      localStorage.setItem('user', JSON.stringify(userWithAvatar))
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Función para registrar un nuevo alumno
  const register = async (studentData) => {
    try {
      setLoading(true)
      
      const registrationData = {
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        gender: studentData.gender || 'masculino',
        phone: studentData.phone || '',
        weight: studentData.weight || '',
        height: studentData.height || '',
        address: studentData.address || '',
        birthDate: studentData.birthDate || ''
      }
      
      // Usar el endpoint de registro que maneja la reclamación de cuentas
      const response = await personasAPI.register(registrationData)
      
      setLoading(false)
      
      // Si el registro requiere verificación de email
      if (response.requiresEmailVerification) {
        setPendingEmailData({ email: response.email, nombre: studentData.name })
        // Navegar a pending-verification usando el callback
        if (navigationCallback) {
          navigationCallback('/pending-verification')
        }
        return true
      }
      
      // Si el backend devuelve la persona (reclamación de cuenta), iniciar sesión automáticamente
      if (response.persona) {
        const userWithAvatar = addAvatarToUser(response.persona)
        setUser(userWithAvatar)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userWithAvatar))
      }
      
      return true
    } catch (error) {
      console.error('Error registering student:', error)
      setLoading(false)
      throw error
    }
  }

  // Función para cargar rutinas del alumno logueado
  const loadMyRoutines = async (currentUser = null) => {
    if (USE_UI_MOCKS) {
      setMyRoutines(mockMyRoutines)
      return
    }

    try {
      // Usar el usuario proporcionado o el del estado
      const userData = currentUser || user
      if (!userData || userData.rol !== 'alumno') return
      
      setLoading(true)
      const rutinas = await personasAPI.getRutinas(userData.idPersona)
      
      // Transformar rutinas con sus ejercicios PERSONALIZADOS
      const rutinasCompletas = await Promise.all(
        rutinas.map(async (rutina) => {
          try {
            // Usar getAlumnoEjercicios para obtener los ejercicios personalizados
            const ejercicios = await rutinasAPI.getAlumnoEjercicios(rutina.idRutina, userData.idPersona, rutina.fechaAsignacion)
            return {
              id: rutina.idRutina,
              name: rutina.nombre,
              createdAt: rutina.fechaHoraCreacion,
              date: rutina.fechaAsignacion ? new Date(rutina.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              fechaAsignacion: rutina.fechaAsignacion,
              status: rutina.estado || 'activa',
              exercises: ejercicios.map(ej => ({
                id: ej.idEjercicio,
                name: ej.nombre,
                sets: ej.cantSets || 3,
                value: ej.cantidad || 10,
                type: ej.tipoContador || 'reps',
                unidad: ej.unidad || ej.tipoContador || 'reps',
                distancia: ej.distancia || null,
                duracion: ej.duracion || null,
                descripcionIntervalo: ej.descripcionIntervalo || null,
                pausaSeries: ej.pausaSeries || null,
                intensidad: ej.intensidad || null,
                esCalentamiento: ej.esCalentamiento || 0,
                especificaciones: ej.especificaciones || null,
                // Campos de seguimiento - CONVERSIÓN EXPLÍCITA de TINYINT(1) a Boolean
                ejercicioCompletado: ej.ejercicioCompletado === 1 || ej.ejercicioCompletado === true,
                feedbackAlumno: ej.feedbackAlumno || '',
                orden: ej.orden
              }))
            }
          } catch (error) {
            console.error(`Error loading exercises for routine ${rutina.idRutina}:`, error)
            return {
              id: rutina.idRutina,
              name: rutina.nombre,
              createdAt: rutina.fechaHoraCreacion,
              date: rutina.fechaAsignacion ? new Date(rutina.fechaAsignacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              fechaAsignacion: rutina.fechaAsignacion,
              status: rutina.estado || 'activa',
              exercises: []
            }
          }
        })
      )
      
      setMyRoutines(rutinasCompletas)
      setLoading(false)
    } catch (error) {
      console.error('Error loading my routines:', error)
      setMyRoutines(mockMyRoutines)
      setLoading(false)
    }
  }

  // Función para actualizar estado de una rutina (para alumno)
  const updateRoutineStatus = async (routineId, newStatus, fechaAsignacion) => {
    try {
      if (!user || user.rol !== 'alumno') return
      
      await rutinasAPI.updateEstado(routineId, user.idPersona, newStatus, fechaAsignacion)
      
      // Recargar rutinas pasando el usuario explícitamente
      await loadMyRoutines(user)
    } catch (error) {
      console.error('Error updating routine status:', error)
      throw error
    }
  }

  // Función para actualizar estado de una rutina de un alumno (para profesor)
  const updateStudentRoutineStatus = async (studentId, routineId, newStatus, fechaAsignacion) => {
    try {
      await rutinasAPI.updateEstado(routineId, studentId, newStatus, fechaAsignacion)
      
      // Recargar datos de estudiantes y devolver la lista actualizada
      const updatedStudents = await refreshStudents()
      return updatedStudents
    } catch (error) {
      console.error('Error updating student routine status:', error)
      throw error
    }
  }

  const value = {
    // Autenticación
    user,
    isAuthenticated,
    login,
    logout,
    
    // Datos
    students,
    setStudents,
    exercises,
    selectedStudent,
    setSelectedStudent,
    savedRoutines,
    loading,
    
    // Alumno
    myRoutines,
    pendingEmailData,
    setPendingEmailData,
    setNavigationCallback,
    
    // Funciones
    saveRoutine,
    updateRoutine,
    deleteRoutine,
    assignRoutineToStudent,
    removeRoutineFromStudent,
    updateStudent,
    updateProfile,
    register,
    loadMyRoutines,
    updateRoutineStatus,
    updateStudentRoutineStatus,
    addStudent,
    addExercise,
    refreshStudents,
    refreshExercises,
    loadStudentDetails,
    
    // Modales
    showAlert,
    showConfirm,
    closeModal,
    
    // Role (para compatibilidad)
    userRole: user?.rol || 'coach',
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      
      {/* Toast para notificaciones simples */}
      <Toast
        isOpen={toastState.isOpen}
        onClose={closeToast}
        message={toastState.message}
        type={toastState.type}
      />
      
      {/* Modal para confirmaciones */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        buttons={modalState.buttons}
      />
    </AppContext.Provider>
  )
}
