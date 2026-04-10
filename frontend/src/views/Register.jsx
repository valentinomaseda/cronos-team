import { useState } from 'react'
import { UserPlus, ArrowLeft, Loader2, Mail, Lock, User, Phone, Calendar, MapPin, Eye, EyeOff } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'

export default function Register() {
  const { register, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'error')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      showAlert('La contraseña debe tener al menos 6 caracteres', 'error')
      setLoading(false)
      return
    }

    try {
      await register(formData)
      // El contexto manejará el cambio a la vista de verificación de email
      // No es necesario redirigir aquí
    } catch (err) {
      showAlert(err.message || 'Error al registrarse', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell overflow-y-auto">
      <div className="w-full max-w-2xl my-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 btn-ghost mb-6 mx-auto"
          >
            <ArrowLeft size={24} strokeWidth={2} />
            <span>Volver al inicio de sesión</span>
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-bg-surface rounded-full mb-4 shadow-md border border-border">
            <UserPlus className="text-brandBlue" size={24} strokeWidth={2} />
          </div>
          <h1 className="title-screen mb-2">
            Registro de Alumno
          </h1>
          <p className="text-lg text-text-muted">Crea tu cuenta para acceder a tus rutinas</p>
        </div>

        {/* Formulario */}
        <div className="surface-brand p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="label-dark">
                <User className="inline mr-2" size={24} strokeWidth={2} />
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-dark">
                <Mail className="inline mr-2" size={24} strokeWidth={2} />
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
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
                disabled={loading}
                required
              />
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="label-dark">
                  <Lock className="inline mr-2" size={24} strokeWidth={2} />
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-brandBlue transition"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={24} strokeWidth={2} /> : <Eye size={24} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label-dark">
                  <Lock className="inline mr-2" size={24} strokeWidth={2} />
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-brandBlue transition"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={24} strokeWidth={2} /> : <Eye size={24} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="label-dark">
                <Phone className="inline mr-2" size={24} strokeWidth={2} />
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
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
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
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
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="birthDate" className="label-dark">
                <Calendar className="inline mr-2" size={24} strokeWidth={2} />
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text disabled:opacity-50"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="label-dark">
                <MapPin className="inline mr-2" size={24} strokeWidth={2} />
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue bg-bg-surface text-text placeholder-text-muted disabled:opacity-50"
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 active:scale-95 transition-transform touch-manipulation flex items-center justify-center gap-2 text-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} strokeWidth={2} />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus size={24} strokeWidth={2} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-text-muted text-center">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-brandBlue hover:underline font-semibold transition"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
