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
    <div className="min-h-screen p-4 pb-40 md:pb-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/alumnos')}
            className="flex items-center gap-2 text-[#1E40AF] hover:text-[#00BFFF] transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver a Alumnos</span>
          </button>
          <h1 className="text-3xl font-black text-[#F3F4F6] flex items-center gap-3">
            <UserPlus className="text-[#00BFFF]" size={36} />
            Agregar Nuevo Alumno
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl p-6 md:p-8 border-2 border-[#1E40AF]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="juan@email.com"
              />
            </div>

            {/* Género */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
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
              <label htmlFor="phone" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            {/* Peso y Altura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="70"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Altura (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/alumnos')}
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
