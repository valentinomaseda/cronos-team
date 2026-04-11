import { useState, useEffect } from 'react'
import { Search, Filter, UserPlus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../components/SkeletonLoader'
import { profesoraAPI } from '../services/api'
import CustomSelect from '../components/CustomSelect'
import { mockStudentsPaginatedResponse } from '../mocks/uiMockData'

export default function StudentList() {
  const { setSelectedStudent, loadStudentDetails, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10, hasNextPage: false, hasPrevPage: false
  })

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await profesoraAPI.getAlumnosPaginados(pagination.currentPage, pagination.limit)
        if (response?.data?.length) {
          setStudents(response.data)
          setPagination(response.pagination)
        } else {
          setStudents(mockStudentsPaginatedResponse.data)
          setPagination(mockStudentsPaginatedResponse.pagination)
        }
      } catch (error) {
        console.error('Error al obtener alumnos:', error)
        setStudents(mockStudentsPaginatedResponse.data)
        setPagination(mockStudentsPaginatedResponse.pagination)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [pagination.currentPage])

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.nivel === levelFilter
    return matchesSearch && matchesLevel
  })

  const handleStudentClick = async (student) => {
    setLoading(true)
    try {
      const studentDetails = await loadStudentDetails(student.idPersona)
      setSelectedStudent(studentDetails)
      navigate(`/alumnos/${student.idPersona}`)
    } catch (error) {
      showAlert('Error al cargar detalles', 'error')
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
        <SkeletonLoader type="card" /><SkeletonLoader type="card" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 pb-32 md:pb-6 animate-fade-in max-w-full overflow-hidden">
      {/* Buscador y Filtros */}
      <div className="flex flex-col md:flex-row gap-3 relative z-30">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10" size={20} strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-surface border border-border rounded-md text-text placeholder:text-text-muted focus:ring-2 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all"
          />
        </div>

        <div className="relative w-full md:w-auto md:min-w-[12rem]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10 pointer-events-none" size={20} strokeWidth={2} />
          <CustomSelect
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los niveles' },
              { value: 'Principiante', label: 'Principiante' },
              { value: 'Intermedio', label: 'Intermedio' },
              { value: 'Avanzado', label: 'Avanzado' }
            ]}
            className="pl-10"
          />
        </div>
      </div>

      <div className="text-sm font-semibold text-text-muted px-1">
        Mostrando {filteredStudents.length} de {pagination.totalRecords} alumnos
      </div>

      {/* Grid de Alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-0">
        {filteredStudents.map((student) => (
          <button
            key={student.idPersona}
            onClick={() => handleStudentClick(student)}
            className={`bg-bg-surface rounded-xl p-5 text-left border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brandBlue/50 active:scale-[0.98] touch-manipulation ${
              student.necesita_rutina ? 'border-primary' : 'border-border'
            } relative z-0`}
          >
            {student.necesita_rutina === 1 && (
              <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                <AlertCircle size={14} strokeWidth={2.5} /> Sin rutina
              </div>
            )}

            <div className="flex items-center space-x-4">
              <img
                src={student.genero === 'femenino' ? '/avatar-fem.jpg' : '/avatar-masc.jpg'}
                alt={student.nombre}
                className={`w-14 h-14 rounded-full border-2 object-cover ${
                  student.necesita_rutina ? 'border-primary' : 'border-transparent'
                }`}
                onError={(e) => e.target.src = '/avatar-masc.jpg'}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-text truncate">{student.nombre || 'Sin nombre'}</h3>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    student.nivel === 'Avanzado' ? 'bg-success/20 text-success' :
                    student.nivel === 'Intermedio' ? 'bg-brandBlue/20 text-brandBlue' :
                    'bg-bg border border-border text-text-muted'
                  }`}>
                    {student.nivel || 'Sin nivel'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-sm text-text-muted truncate">
                {student.mail || 'Sin email'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-text-muted font-medium">No se encontraron alumnos</p>
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center space-y-3">
          <div className="flex gap-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 py-3 px-6 rounded-md bg-bg-surface border border-border text-text font-bold active:scale-95 disabled:opacity-50 touch-manipulation"
            >
              <ChevronLeft size={20} /> Anterior
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-2 py-3 px-6 rounded-md bg-bg-surface border border-border text-text font-bold active:scale-95 disabled:opacity-50 touch-manipulation"
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
          <span className="text-sm font-medium text-text-muted">Página {pagination.currentPage} de {pagination.totalPages}</span>
        </div>
      )}

      {/* FAB - Agregar Alumno */}
      <button
        onClick={() => navigate('/agregar-alumno')}
        className="fixed bottom-20 md:bottom-8 right-8 bg-brandBlue text-white p-4 rounded-full shadow-lg hover:opacity-90 active:scale-90 transition-all z-50 flex items-center justify-center"
      >
        <UserPlus size={24} strokeWidth={2} />
      </button>
    </div>
  )
}