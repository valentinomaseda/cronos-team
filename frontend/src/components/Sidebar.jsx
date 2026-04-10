import { Users, ClipboardList, UserCircle, LogOut, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { setSelectedStudent, logout, user, showConfirm } = useAppContext()
  const location = useLocation()

  const handleNavigation = () => {
    setSelectedStudent(null)
  }

  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro que deseas cerrar sesión?',
      () => logout(),
      'Cerrar Sesión'
    )
  }

  // Opciones de navegación para alumnos
  const studentNavItems = [
    { id: 'studentRoutines', label: 'Mis Rutinas', icon: ClipboardList, path: '/mis-rutinas' },
    { id: 'studentProgress', label: 'Mi Progreso', icon: TrendingUp, path: '/mi-progreso' },
    { id: 'profile', label: 'Perfil', icon: UserCircle, path: '/perfil' },
  ]

  // Opciones de navegación para coaches
  const coachNavItems = [
    { id: 'students', label: 'Alumnos', icon: Users, path: '/alumnos' },
    { id: 'routines', label: 'Rutinas', icon: ClipboardList, path: '/rutinas' },
    { id: 'profile', label: 'Perfil', icon: UserCircle, path: '/perfil' },
  ]

  const navItems = user?.rol === 'alumno' ? studentNavItems : coachNavItems
  const dashboardTitle = user?.rol === 'alumno' ? 'Mi Dashboard' : 'Dashboard Coach'
  const userFallback = user?.rol === 'alumno' ? 'Alumno' : 'Coach Admin'

  const isActive = (path) => {
    if (path === '/alumnos') {
      return location.pathname === '/alumnos' || location.pathname.startsWith('/alumnos/')
    }
    return location.pathname === path
  }

  return (
    <aside className="hidden md:flex flex-col w-64 nav-shell border-r shadow-sm h-[calc(100vh-4rem)] fixed left-0 top-16 animate-slide-in-left">
      <div className="p-6 border-b border-border-accent animate-fade-in delay-200">
        <p className="text-lg font-bold text-cyan">{dashboardTitle}</p>
        {user?.nombre && (
          <p className="text-sm text-text-on-dark mt-1">Bienvenido, {user.nombre.split(' ')[0]}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon, path }, index) => (
          <Link
            key={id}
            to={path}
            onClick={handleNavigation}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 animate-slide-in-left ${
              isActive(path)
                ? 'bg-cyan text-[#1e1e1e] shadow-md'
                : 'text-text-on-dark hover:bg-cyanDeep'
            }`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <Icon size={22} strokeWidth={2.5} />
            <span className="font-semibold">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border-accent space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-cyanDeep rounded-lg">
          <UserCircle size={32} className="text-cyan" strokeWidth={2} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-on-dark truncate">{user?.nombre || userFallback}</p>
            <p className="text-xs text-cyan">Sesión activa</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
