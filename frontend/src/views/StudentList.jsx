import { useState, useEffect } from 'react'
import { Search, Filter, UserPlus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../components/SkeletonLoader'
import { profesoraAPI } from '../services/api'
import CustomSelect from '../components/CustomSelect'

export default function StudentList() {
  const { setSelectedStudent, loadStudentDetails, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch alumnos desde el servidor con paginación
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await profesoraAPI.getAlumnosPaginados(pagination.currentPage, pagination.limit)
        setStudents(response.data)
        setPagination(response.pagination)
      } catch (error) {
        console.error('Error al obtener alumnos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [pagination.currentPage])

  // Filtrado local (opcional, si quieres filtrar los datos ya cargados)
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.nivel === levelFilter
    return matchesSearch && matchesLevel
  })

  const handleStudentClick = async (student) => {
    setLoading(true)
    try {
      // Cargar detalles completos del alumno desde el servidor
      const studentDetails = await loadStudentDetails(student.idPersona)
      setSelectedStudent(studentDetails)
      navigate(`/alumnos/${student.idPersona}`)
    } catch (error) {
      console.error('Error al cargar detalles del alumno:', error)
      showAlert('Error al cargar los detalles del alumno', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 pb-32 md:pb-6 animate-fade-in max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row gap-3 animate-slide-in-left relative z-30">
        {/* Buscador */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFFF] z-10" size={20} />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg bg-[#111827] text-[#F3F4F6] placeholder-gray-400"
          />
        </div>

        {/* Filtro de nivel */}
        <div className="relative w-full md:w-auto md:min-w-[12rem]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFFF] z-10 pointer-events-none" size={20} />
          <CustomSelect
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los niveles' },
              { value: 'Principiante', label: 'Principiante' },
              { value: 'Intermedio', label: 'Intermedio' },
              { value: 'Avanzado', label: 'Avanzado' }
            ]}
            className="w-full pl-10 text-lg"
          />
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-gray-400 px-1">
        Mostrando {filteredStudents.length} de {pagination.totalRecords} alumnos
      </div>

      {/* Lista de alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-0">
        {filteredStudents.map((student, index) => (
          <button
            key={student.idPersona}
            onClick={() => handleStudentClick(student)}
            className={`bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-md hover:shadow-2xl transition-all p-6 text-left hover:scale-105 active:scale-95 border-2 ${
              student.necesita_rutina 
                ? 'border-red-500' 
                : 'border-transparent hover:border-[#00BFFF]'
            } relative z-0`}
          >
            {/* Badge de alerta */}
            {student.necesita_rutina === 1 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <AlertCircle size={14} />
                Sin rutina
              </div>
            )}

            <div className="flex items-center space-x-4">
              <img
                src={student.genero === 'femenino' ? '/avatar-fem.jpg' : '/avatar-masc.jpg'}
                alt={student.nombre || 'Usuario'}
                className={`w-16 h-16 rounded-full border-4 object-cover ${
                  student.necesita_rutina ? 'border-red-500' : 'border-[#00BFFF]'
                }`}
                onError={(e) => {
                  e.target.src = '/avatar-masc.jpg'
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#F3F4F6]">{student.nombre || 'Sin nombre'}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      student.nivel === 'Avanzado'
                        ? 'bg-[#00FF88] text-[#111827]'
                        : student.nivel === 'Intermedio'
                        ? 'bg-[#00BFFF] text-[#111827]'
                        : 'bg-[#FFD700] text-[#111827]'
                    }`}
                  >
                    {student.nivel || 'Sin nivel'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#111827]">
              <p className="text-xs text-[#f2fcff]">
                {student.mail || 'Sin email'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[#F3F4F6] text-lg">No se encontraron alumnos</p>
        </div>
      )}

      {/* Controles de paginación Mobile-First */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`flex items-center justify-center gap-2 py-4 px-8 rounded-xl text-lg font-bold transition-all shadow-lg ${
                pagination.hasPrevPage
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#00BFFF] text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={24} />
              Anterior
            </button>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center justify-center gap-2 py-4 px-8 rounded-xl text-lg font-bold transition-all shadow-lg ${
                pagination.hasNextPage
                  ? 'bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Siguiente
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicador de página */}
          <div className="text-center text-sm text-gray-400">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
        </div>
      )}

      {/* Botón flotante para añadir alumno */}
      <button
        onClick={() => navigate('/agregar-alumno')}
        className="fixed bottom-20 md:bottom-8 right-8 bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2"
        title="Agregar Alumno"
      >
        <UserPlus size={20} />
        <span className="text-sm font-semibold">
          Agregar Alumno
        </span>
      </button>
    </div>
  )
}
