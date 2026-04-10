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
    name: '',
    email: '',
    gender: 'masculino',
    phone: '',
    weight: '',
    height: '',
    address: '',
    birthDate: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
    <div className="page-shell pb-40 md:pb-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/alumnos')}
            className="flex items-center gap-2 btn-ghost mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver a Alumnos</span>
          </button>
          <h1 className="title-screen flex items-center gap-3">
            <UserPlus className="text-cyan" size={36} />
            Agregar Nuevo Alumno
          </h1>
        </div>

        {/* Formulario */}
        <div className="surface-panel p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="label-dark">
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-dark">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                placeholder="juan@email.com"
              />
            </div>

            {/* Género */}
            <div>
              <label htmlFor="gender" className="label-dark">
                Género *
              </label>
              <CustomSelect
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'femenino', label: 'Femenino' }
                ]}
                required
                className="text-lg"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="label-dark">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            {/* Peso y Altura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="label-dark">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                  placeholder="70"
                />
              </div>

              <div>
                <label htmlFor="height" className="label-dark">
                  Altura (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="birthDate" className="label-dark">
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="label-dark">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="text-[#ffffff] bg-[#1e1e1e] w-full px-4 py-3 border-2 border-[#0697d8] rounded-lg focus:ring-2 focus:ring-[#0697d8] focus:border-transparent text-lg"
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/alumnos')}
                disabled={loading}
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Crear Alumno
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
