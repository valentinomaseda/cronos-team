import { Users, ClipboardList, UserCircle, Activity, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNavbar() {
  const { setSelectedStudent, user } = useAppContext()
  const location = useLocation()

  const handleNavigation = () => {
    setSelectedStudent(null)
  }

  // Opciones de navegación para alumnos
  const studentNavItems = [
    { id: 'studentRoutines', label: 'Rutinas', icon: ClipboardList, path: '/mis-rutinas' },
    { id: 'studentProgress', label: 'Progreso', icon: TrendingUp, path: '/mi-progreso' },
    { id: 'profile', label: 'Perfil', icon: UserCircle, path: '/perfil' },
  ]

  // Opciones de navegación para coaches
  const coachNavItems = [
    { id: 'students', label: 'Alumnos', icon: Users, path: '/alumnos' },
    { id: 'routines', label: 'Rutinas', icon: ClipboardList, path: '/rutinas' },
    { id: 'profile', label: 'Perfil', icon: UserCircle, path: '/perfil' },
  ]

  const navItems = user?.rol === 'alumno' ? studentNavItems : coachNavItems

  const isActive = (path) => {
    if (path === '/alumnos') {
      return location.pathname === '/alumnos' || location.pathname.startsWith('/alumnos/')
    }
    return location.pathname === path
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 nav-shell border-t shadow-lg z-50 animate-slide-in-up">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ id, label, icon: Icon, path }, index) => (
          <Link
            key={id}
            to={path}
            onClick={handleNavigation}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 animate-fade-in ${
              isActive(path)
                ? 'text-cyan bg-cyanDeep'
                : 'text-text-on-dark hover:text-cyan hover:bg-cyanDeep'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-xs font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
