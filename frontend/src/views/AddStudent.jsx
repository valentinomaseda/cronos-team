import { useState } from 'react'
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'

export default function AddStudent() {
  const { addStudent, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '', email: '', gender: 'masculino', phone: '',
    weight: '', height: '', address: '', birthDate: ''
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addStudent(formData)
      showAlert('Alumno creado exitosamente', 'success')
      navigate('/alumnos')
    } catch (err) {
      showAlert(err.message || 'Error al crear el alumno', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 pb-32 md:pb-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <button 
            onClick={() => navigate('/alumnos')}
            className="p-2 bg-bg-surface border border-border text-text-muted rounded-md hover:text-text active:scale-95 transition-all touch-manipulation"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <UserPlus className="text-brandBlue" size={28} strokeWidth={2} />
          <h2 className="font-display text-2xl text-text uppercase">Nuevo Alumno</h2>
        </div>

        <div className="bg-bg-surface rounded-xl shadow-sm p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campos principales */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-text">Nombre Completo *</label>
              <input
                id="name" name="name" type="text" required
                value={formData.name} onChange={handleChange}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-text">Email *</label>
              <input
                id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                placeholder="juan@email.com"
              />
            </div>

            {/* Grid para datos físicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text">Género</label>
                <CustomSelect
                  name="gender" value={formData.gender} onChange={handleChange}
                  options={[
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'femenino', label: 'Femenino' },
                    { value: 'otro', label: 'Otro' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-bold text-text">Fecha Nacimiento *</label>
                <input
                  id="birthDate" name="birthDate" type="date" required
                  value={formData.birthDate} onChange={handleChange}
                  className="w-full bg-bg-surface border border-border text-text rounded-md px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="weight" className="block text-sm font-bold text-text">Peso (kg)</label>
                <input
                  id="weight" name="weight" type="number" step="0.1" min="30" max="200"
                  value={formData.weight} onChange={handleChange}
                  placeholder="Ej: 70.5"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="height" className="block text-sm font-bold text-text">Altura (cm)</label>
                <input
                  id="height" name="height" type="number" min="100" max="250"
                  value={formData.height} onChange={handleChange}
                  placeholder="Ej: 175"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => navigate('/alumnos')}
                disabled={loading}
                className="w-full sm:w-1/3 bg-bg border border-border text-text font-bold py-3 rounded-md active:scale-95 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-2/3 bg-brandBlue text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} strokeWidth={2} />}
                <span>{loading ? 'Guardando...' : 'Crear Alumno'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}