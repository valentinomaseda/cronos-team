import { useState } from 'react'
import { UserCircle, Mail, Phone, Award, LogOut, X, Edit, MapPin, Cake, Weight, Ruler, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import CustomSelect from '../components/CustomSelect'

export default function Profile() {
  const { user, students, logout, updateProfile, showConfirm, showAlert } = useAppContext()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro que deseas cerrar sesión?',
      () => logout(),
      'Cerrar Sesión'
    )
  }

  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    // Validar contraseñas si se están cambiando
    if (editFormData.currentPassword || editFormData.newPassword || editFormData.confirmPassword) {
      if (!editFormData.currentPassword) {
        showAlert('Debes ingresar tu contraseña actual', 'error')
        return
      }
      if (!editFormData.newPassword) {
        showAlert('Debes ingresar una nueva contraseña', 'error')
        return
      }
      if (editFormData.newPassword !== editFormData.confirmPassword) {
        showAlert('Las contraseñas nuevas no coinciden', 'error')
        return
      }
      if (editFormData.newPassword.length < 6) {
        showAlert('La nueva contraseña debe tener al menos 6 caracteres', 'error')
        return
      }
    }
    
    setUpdating(true)
    try {
      await updateProfile(editFormData)
      setShowEditModal(false)
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      showAlert('Perfil actualizado exitosamente', 'success')
    } catch (error) {
      showAlert(error.message || 'Error al actualizar el perfil', 'error')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <UserCircle className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#F3F4F6]">Mi Perfil</h2>
      </div>

      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 space-y-6 animate-slide-in-up delay-100 border border-[#00BFFF]/20">
        <div className="flex flex-col items-center animate-scale-in delay-200">
          <div className="w-32 h-32 bg-[#00BFFF] rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {user?.photo ? (
              <img src={user.photo} alt={user.nombre} className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={80} className="text-[#111827]" strokeWidth={2} />
            )}
          </div>
          <h3 className="text-2xl font-bold text-[#F3F4F6]">{user?.nombre || 'Coach Admin'}</h3>
          <p className="text-[#00BFFF] mt-1">
            {user?.rol === 'entrenador' ? 'Entrenador Principal' : 
             user?.rol === 'admin' ? 'Administrador' : 
             user?.rol === 'alumno' ? 'Alumno' : 'Usuario'}
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#111827]">
          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-300">
            <Mail className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Email</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.mail || 'coach@adrenalinaxtrema.com'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-400">
            <Phone className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Teléfono</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.tel || 'No especificado'}</p>
            </div>
          </div>

          {user?.rol === 'alumno' ? (
            <>
              {(user?.domicilio || user?.direccion) && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <MapPin className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Dirección</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.domicilio || user.direccion}</p>
                  </div>
                </div>
              )}

              {user?.fechaNacimiento && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <Cake className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Fecha de Nacimiento</p>
                    <p className="font-semibold text-[#F3F4F6]">
                      {new Date(user.fechaNacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {user?.genero && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <User className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Género</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.genero === 'masculino' ? 'Masculino' : 'Femenino'}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {user?.peso && (
                  <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                    <Weight className="text-[#00BFFF]" size={24} />
                    <div>
                      <p className="text-xs text-[#00BFFF]">Peso</p>
                      <p className="font-semibold text-[#F3F4F6]">{user.peso} kg</p>
                    </div>
                  </div>
                )}

                {user?.altura && (
                  <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                    <Ruler className="text-[#00BFFF]" size={24} />
                    <div>
                      <p className="text-xs text-[#00BFFF]">Altura</p>
                      <p className="font-semibold text-[#F3F4F6]">{user.altura} cm</p>
                    </div>
                  </div>
                )}
              </div>

              {user?.nivel && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <Award className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Nivel</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.nivel}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
              <Award className="text-[#00BFFF]" size={24} />
              <div>
                <p className="text-xs text-[#00BFFF]">Alumnos Activos</p>
                <p className="font-semibold text-[#F3F4F6]">{students?.length || 0} atletas</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => {
              // Formatear fechaNacimiento para input type="date" (YYYY-MM-DD)
              let formattedDate = '';
              if (user?.fechaNacimiento) {
                const date = new Date(user.fechaNacimiento);
                // Asegurarse de usar UTC para evitar problemas de zona horaria
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const day = String(date.getUTCDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
              }

              setEditFormData({
                nombre: user?.nombre || '',
                mail: user?.mail || '',
                tel: user?.tel || '',
                domicilio: user?.direccion || user?.domicilio || '',
                fechaNacimiento: formattedDate,
                peso: user?.peso || '',
                altura: user?.altura || '',
                genero: user?.genero || 'masculino',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              })
              setShowCurrentPassword(false)
              setShowNewPassword(false)
              setShowConfirmPassword(false)
              setShowEditModal(true)
            }}
            className="w-full px-6 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold animate-fade-in delay-500 flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Editar Perfil
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all font-semibold animate-fade-in delay-600 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-scale-in border border-[#00BFFF]">
            <div className="flex-shrink-0 bg-[#1E40AF] text-white p-6 flex items-center justify-between rounded-t-xl z-10">
              <h3 className="text-xl font-bold">Editar Perfil</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#00BFFF] rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleEditProfile} className="p-6 space-y-4 pb-8">"
              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  value={editFormData.nombre || ''}
                  onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.mail || ''}
                  onChange={(e) => setEditFormData({...editFormData, mail: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={editFormData.tel || ''}
                  onChange={(e) => setEditFormData({...editFormData, tel: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              {user?.rol === 'alumno' && (
                <>
                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Género</label>
                    <CustomSelect
                      value={editFormData.genero || 'masculino'}
                      onChange={(e) => setEditFormData({...editFormData, genero: e.target.value})}
                      options={[
                        { value: 'masculino', label: 'Masculino' },
                        { value: 'femenino', label: 'Femenino' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Domicilio</label>
                    <input
                      type="text"
                      value={editFormData.domicilio || ''}
                      onChange={(e) => setEditFormData({...editFormData, domicilio: e.target.value})}
                      className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={editFormData.fechaNacimiento || ''}
                      onChange={(e) => setEditFormData({...editFormData, fechaNacimiento: e.target.value})}
                      className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#00BFFF] font-semibold mb-2">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editFormData.peso || ''}
                        onChange={(e) => setEditFormData({...editFormData, peso: e.target.value})}
                        className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#00BFFF] font-semibold mb-2">Altura (cm)</label>
                      <input
                        type="number"
                        value={editFormData.altura || ''}
                        onChange={(e) => setEditFormData({...editFormData, altura: e.target.value})}
                        className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Sección de cambio de contraseña */}
              <div className="border-t border-[#1E40AF] pt-4 mt-4">
                <h4 className="text-[#00BFFF] font-bold mb-3">Cambiar Contraseña</h4>
                <p className="text-xs text-gray-400 mb-4">Solo completa estos campos si deseas cambiar tu contraseña</p>
                
                <div className="space-y-3">
                  {/* Contraseña actual */}
                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Contraseña Actual</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={editFormData.currentPassword || ''}
                        onChange={(e) => setEditFormData({...editFormData, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 pr-12 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00BFFF] transition"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={editFormData.newPassword || ''}
                        onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                        className="w-full px-4 py-3 pr-12 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00BFFF] transition"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={editFormData.confirmPassword || ''}
                        onChange={(e) => setEditFormData({...editFormData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 pr-12 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                        placeholder="Repite la nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00BFFF] transition"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones del modal */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
