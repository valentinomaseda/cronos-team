export const mockExercises = [
  {
    id: 101,
    name: 'Sentadilla Goblet',
    defaultType: 'reps',
    unidad: 'reps',
    distancia: null,
    duracion: null,
    descripcionIntervalo: 'Controlar descenso 3 segundos'
  },
  {
    id: 102,
    name: 'Remo con Banda',
    defaultType: 'reps',
    unidad: 'reps',
    distancia: null,
    duracion: null,
    descripcionIntervalo: 'Pausa de 1 segundo en retraccion'
  },
  {
    id: 103,
    name: 'Plancha Frontal',
    defaultType: 'segundos',
    unidad: 'segundos',
    distancia: null,
    duracion: '45',
    descripcionIntervalo: 'Respiracion controlada'
  },
  {
    id: 104,
    name: 'Trote Aerobico',
    defaultType: 'km',
    unidad: 'km',
    distancia: '5',
    duracion: null,
    descripcionIntervalo: 'Ritmo conversacional'
  }
]

export const mockSavedRoutines = [
  {
    id: 201,
    name: 'Base Fuerza A',
    createdAt: '2026-04-02T09:00:00.000Z',
    exercises: [
      { id: 101, exerciseId: 101, name: 'Sentadilla Goblet', sets: 4, value: 10, type: 'reps', unidad: 'reps' },
      { id: 102, exerciseId: 102, name: 'Remo con Banda', sets: 4, value: 12, type: 'reps', unidad: 'reps' },
      { id: 103, exerciseId: 103, name: 'Plancha Frontal', sets: 3, value: 45, type: 'segundos', unidad: 'segundos' }
    ]
  },
  {
    id: 202,
    name: 'Aerobico Controlado',
    createdAt: '2026-04-04T10:30:00.000Z',
    exercises: [
      { id: 104, exerciseId: 104, name: 'Trote Aerobico', sets: 1, value: 5, type: 'km', unidad: 'km' },
      { id: 103, exerciseId: 103, name: 'Plancha Frontal', sets: 3, value: 30, type: 'segundos', unidad: 'segundos' }
    ]
  }
]

const mockRoutineHistoryTemplate = [
  {
    id: 201,
    name: 'Base Fuerza A',
    date: '2026-04-06',
    fechaAsignacion: '2026-04-06T07:30:00.000Z',
    status: 'completada',
    completed: true,
    exercises: [
      { id: 101, exerciseId: 101, name: 'Sentadilla Goblet', sets: 4, value: 10, type: 'reps', unidad: 'reps', ejercicioCompletado: true, feedbackAlumno: 'Buena sesion, fatiga moderada', orden: 1 },
      { id: 102, exerciseId: 102, name: 'Remo con Banda', sets: 4, value: 12, type: 'reps', unidad: 'reps', ejercicioCompletado: true, feedbackAlumno: '', orden: 2 }
    ]
  },
  {
    id: 202,
    name: 'Aerobico Controlado',
    date: '2026-04-09',
    fechaAsignacion: '2026-04-09T07:30:00.000Z',
    status: 'activa',
    completed: false,
    exercises: [
      { id: 104, exerciseId: 104, name: 'Trote Aerobico', sets: 1, value: 5, type: 'km', unidad: 'km', ejercicioCompletado: false, feedbackAlumno: '', orden: 1 },
      { id: 103, exerciseId: 103, name: 'Plancha Frontal', sets: 3, value: 30, type: 'segundos', unidad: 'segundos', ejercicioCompletado: false, feedbackAlumno: '', orden: 2 }
    ]
  }
]

export const mockStudents = [
  {
    id: 1,
    idPersona: 1,
    name: 'Lucia Roldan',
    nombre: 'Lucia Roldan',
    photo: '/avatar-fem.jpg',
    level: 'Intermedio',
    nivel: 'Intermedio',
    gender: 'femenino',
    genero: 'femenino',
    phone: '1134567890',
    email: 'lucia.mock@cronos.com',
    weight: 58,
    height: 166,
    address: 'Palermo, CABA',
    birthDate: '1999-11-10',
    necesita_rutina: 0,
    progress: [],
    routineHistory: mockRoutineHistoryTemplate
  },
  {
    id: 2,
    idPersona: 2,
    name: 'Mateo Gimenez',
    nombre: 'Mateo Gimenez',
    photo: '/avatar-masc.jpg',
    level: 'Avanzado',
    nivel: 'Avanzado',
    gender: 'masculino',
    genero: 'masculino',
    phone: '1166778899',
    email: 'mateo.mock@cronos.com',
    weight: 76,
    height: 178,
    address: 'Belgrano, CABA',
    birthDate: '1997-04-21',
    necesita_rutina: 1,
    progress: [],
    routineHistory: [mockRoutineHistoryTemplate[0]]
  },
  {
    id: 3,
    idPersona: 3,
    name: 'Camila Soto',
    nombre: 'Camila Soto',
    photo: '/avatar-fem.jpg',
    level: 'Principiante',
    nivel: 'Principiante',
    gender: 'femenino',
    genero: 'femenino',
    phone: '1144556677',
    email: 'camila.mock@cronos.com',
    weight: 63,
    height: 170,
    address: 'Caballito, CABA',
    birthDate: '2002-08-02',
    necesita_rutina: 0,
    progress: [],
    routineHistory: []
  }
]

export const mockStudentsPaginatedResponse = {
  data: mockStudents.map((s) => ({
    idPersona: s.idPersona,
    nombre: s.nombre,
    nivel: s.nivel,
    genero: s.genero,
    necesita_rutina: s.necesita_rutina
  })),
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: mockStudents.length,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  }
}

export const mockMyRoutines = [
  ...mockRoutineHistoryTemplate.map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: '2026-04-01T08:00:00.000Z',
    date: r.date,
    fechaAsignacion: r.fechaAsignacion,
    status: r.status,
    exercises: r.exercises
  }))
]
