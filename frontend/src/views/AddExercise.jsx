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
    name: '',
    unidad: 'reps',
    distancia: '',
    duracion: '',
    descripcionIntervalo: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

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
    <div className="min-h-screen p-4 pb-32 md:pb-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/rutinas')}
            className="flex items-center gap-2 text-[#1E40AF] hover:text-[#00BFFF] transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver a Rutinas</span>
          </button>
          <h1 className="text-3xl font-black text-[#F3F4F6] flex items-center gap-3">
            <Dumbbell className="text-[#00BFFF]" size={36} />
            Agregar Nuevo Ejercicio
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl p-6 md:p-8 border-2 border-[#1E40AF]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Ejercicio */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Nombre del Ejercicio *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Ej: Burpees, Sentadillas, Plancha..."
              />
            </div>

            {/* Unidad de Medida */}
            <div>
              <label htmlFor="unidad" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Unidad de Medida *
              </label>
              <CustomSelect
                id="unidad"
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                options={[
                  { value: 'reps', label: 'Repeticiones' },
                  { value: 'segundos', label: 'Segundos' },
                  { value: 'minutos', label: 'Minutos' },
                  { value: 'horas', label: 'Horas' },
                  { value: 'km', label: 'Kilómetros' },
                  { value: 'metros', label: 'Metros' }
                ]}
                required
                className="text-lg"
              />
              <p className="text-sm text-[#9CA3AF] mt-2">
                Selecciona la unidad principal para este ejercicio. Las cantidades específicas se asignarán al agregar el ejercicio a una rutina.
              </p>
            </div>

            {/* Distancia (para km o metros) */}
            {(formData.unidad === 'km' || formData.unidad === 'metros') && (
              <div>
                <label htmlFor="distancia" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Distancia Predeterminada
                </label>
                <input
                  id="distancia"
                  name="distancia"
                  type="text"
                  value={formData.distancia}
                  onChange={handleChange}
                  className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="Ej: 5, 10, 21..."
                />
                <p className="text-sm text-[#9CA3AF] mt-2">
                  Opcional: Define una distancia por defecto (solo número, sin unidad)
                </p>
              </div>
            )}

            {/* Duración (para tiempo) */}
            {(formData.unidad === 'segundos' || formData.unidad === 'minutos' || formData.unidad === 'horas') && (
              <div>
                <label htmlFor="duracion" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Duración Predeterminada
                </label>
                <input
                  id="duracion"
                  name="duracion"
                  type="text"
                  value={formData.duracion}
                  onChange={handleChange}
                  className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="Ej: 30, 5, 90..."
                />
                <p className="text-sm text-[#9CA3AF] mt-2">
                  Opcional: Define una duración por defecto (solo número, sin unidad)
                </p>
              </div>
            )}

            {/* Descripción de Intervalo */}
            <div>
              <label htmlFor="descripcionIntervalo" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Descripción de Intervalos
              </label>
              <textarea
                id="descripcionIntervalo"
                name="descripcionIntervalo"
                value={formData.descripcionIntervalo}
                onChange={handleChange}
                rows="3"
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Ej: 3' suaves x 3' fuertes, rápidos km 4, 8 y 12..."
              />
              <p className="text-sm text-[#9CA3AF] mt-2">
                Opcional: Especifica intervalos, ritmos o detalles adicionales del ejercicio
              </p>
            </div>

            {/* Vista Previa */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-lg p-6 border-2 border-[#00BFFF]">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Vista Previa:</h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#F3F4F6]">
                  {formData.name || 'Nombre del Ejercicio'}
                </p>
                <p className="text-lg text-gray-300">
                  Unidad: <span className="font-semibold text-[#00BFFF]">
                    {formData.unidad === 'reps' ? 'Repeticiones' : 
                     formData.unidad === 'segundos' ? 'Segundos' :
                     formData.unidad === 'minutos' ? 'Minutos' :
                     formData.unidad === 'horas' ? 'Horas' :
                     formData.unidad === 'km' ? 'Kilómetros' :
                     'Metros'}
                  </span>
                </p>
                {formData.distancia && (
                  <p className="text-base text-gray-300">
                    Distancia: <span className="font-semibold text-[#00BFFF]">
                      {formData.distancia} {formData.unidad === 'km' ? 'km' : 'metros'}
                    </span>
                  </p>
                )}
                {formData.duracion && (
                  <p className="text-base text-gray-300">
                    Duración: <span className="font-semibold text-[#00BFFF]">
                      {formData.duracion} {formData.unidad === 'segundos' ? 'segundos' : formData.unidad === 'minutos' ? 'minutos' : 'horas'}
                    </span>
                  </p>
                )}
                {formData.descripcionIntervalo && (
                  <p className="text-base text-gray-300">
                    Intervalos: <span className="font-semibold text-[#00BFFF]">{formData.descripcionIntervalo}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/rutinas')}
                disabled={loading}
                className="flex-1 bg-gray-700 text-[#F3F4F6] font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Dumbbell size={20} />
                    Crear Ejercicio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
