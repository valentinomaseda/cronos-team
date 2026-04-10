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
    const studentName = student?.nombre || student?.name || ''
    const studentLevel = student?.nivel || student?.level || ''
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || studentLevel === levelFilter
    return matchesSearch && matchesLevel
  })

  const handleStudentClick = async (student) => {
    setLoading(true)
    try {
      const studentDetails = await loadStudentDetails(student.idPersona)
      setSelectedStudent(studentDetails)
      navigate(`/alumnos/${student.idPersona}`)
    } catch (error) {
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
        <SkeletonLoader type="card" /><SkeletonLoader type="card" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-6 max-w-full overflow-hidden">
      
      {/* Controles de Búsqueda y Filtro */}
      <div className="flex flex-col md:flex-row gap-3 relative z-30">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10" size={20} />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10" // Toma los estilos base de index.css
          />
        </div>
        <div className="relative w-full md:w-auto md:min-w-[12rem]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10 pointer-events-none" size={20} />
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

      <div className="text-sm text-text-muted px-1 font-semibold">
        Mostrando {filteredStudents.length} de {pagination.totalRecords} alumnos
      </div>

      {/* Grid de Alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-0">
        {filteredStudents.map((student) => (
          <button
            key={student.idPersona}
            onClick={() => handleStudentClick(student)}
            className={`bg-bg-surface rounded-xl shadow-sm border p-5 text-left active:scale-95 transition-transform touch-manipulation ${
              student.necesita_rutina ? 'border-primary' : 'border-border-accent/60'
            } relative z-0`}
          >
            {student.necesita_rutina === 1 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <AlertCircle size={14} /> Sin rutina
              </div>
            )}

            <div className="flex items-center space-x-4">
              <img
                src={student.genero === 'femenino' ? '/avatar-fem.jpg' : '/avatar-masc.jpg'}
                alt={student.nombre}
                className={`w-14 h-14 rounded-full border-2 object-cover ${
                  student.necesita_rutina ? 'border-primary' : 'border-transparent'
                }`}
                onError={(e) => { e.target.src = '/avatar-masc.jpg' }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text truncate">{student.nombre || student.name || 'Sin nombre'}</h3>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    student.nivel === 'Avanzado' ? 'bg-success/20 text-success' : 
                    student.nivel === 'Intermedio' ? 'bg-brandBlue/20 text-brandBlue' : 
                    'bg-gray-200 text-text-muted'
                  }`}>
                    {student.nivel || 'Sin nivel'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Paginación Mobile-First */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center space-y-3">
          <div className="flex gap-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 py-3 px-6 rounded-md bg-bg-surface border border-border text-text font-bold active:scale-95 disabled:opacity-50"
            >
              <ChevronLeft size={20} /> Anterior
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-2 py-3 px-6 rounded-md bg-bg-surface border border-border text-text font-bold active:scale-95 disabled:opacity-50"
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
          <span className="text-sm text-text-muted font-medium">Página {pagination.currentPage} de {pagination.totalPages}</span>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/agregar-alumno')}
        className="fixed bottom-20 md:bottom-8 right-8 btn-primary p-4 rounded-full shadow-lg active:scale-90 z-50 flex items-center gap-2"
      >
        <UserPlus size={24} />
      </button>
    </div>
  )
}