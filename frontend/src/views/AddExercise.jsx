import { useState } from 'react'
import { Dumbbell, ArrowLeft, Loader2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'

export default function AddExercise() {
  const { addExercise, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '', unidad: 'reps', distancia: '', duracion: '', descripcionIntervalo: ''
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addExercise(formData)
      showAlert('Ejercicio creado exitosamente', 'success')
      navigate('/rutinas')
    } catch (err) {
      showAlert(err.message || 'Error al crear el ejercicio', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 pb-32 md:pb-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <button 
            onClick={() => navigate('/rutinas')}
            className="p-2 bg-bg-surface border border-border text-text-muted rounded-md hover:text-text active:scale-95 transition-all touch-manipulation"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <Dumbbell className="text-brandBlue" size={28} strokeWidth={2} />
          <h2 className="font-display text-2xl text-text uppercase">Nuevo Ejercicio</h2>
        </div>

        <div className="bg-bg-surface rounded-xl shadow-sm p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-text">Nombre del Ejercicio *</label>
              <input
                id="name" name="name" type="text" required
                value={formData.name} onChange={handleChange}
                placeholder="Ej: Pasadas 400m"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text">Unidad Principal</label>
                <CustomSelect
                  name="unidad" value={formData.unidad} onChange={handleChange}
                  options={[
                    { value: 'reps', label: 'Repeticiones' },
                    { value: 'segundos', label: 'Segundos' },
                    { value: 'minutos', label: 'Minutos' },
                    { value: 'horas', label: 'Horas' },
                    { value: 'km', label: 'Kilómetros' },
                    { value: 'metros', label: 'Metros' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="distancia" className="block text-sm font-bold text-text">Distancia Predeterminada (Opcional)</label>
                <input
                  id="distancia" name="distancia" type="number" step="0.01" min="0"
                  value={formData.distancia} onChange={handleChange}
                  placeholder="Ej: 5 (km)"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border mt-6">
              <button
                type="button" onClick={() => navigate('/rutinas')} disabled={loading}
                className="w-full sm:w-1/3 bg-bg border border-border text-text font-bold py-3 rounded-md active:scale-95 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit" disabled={loading}
                className="w-full sm:w-2/3 bg-primary text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Dumbbell size={20} strokeWidth={2} />}
                <span>{loading ? 'Guardando...' : 'Crear Ejercicio'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}