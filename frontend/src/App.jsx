import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import BottomNavbar from './components/BottomNavbar'
import Header from './components/Header'
import StudentList from './views/StudentList'
import StudentDetail from './views/StudentDetail'
import RoutineBuilder from './views/RoutineBuilder'
import Profile from './views/Profile'
import Login from './views/Login'
import Register from './views/Register'
import AddStudent from './views/AddStudent'
import AddExercise from './views/AddExercise'
import StudentRoutines from './views/StudentRoutines'
import StudentProgress from './views/StudentProgress'
import VerifyEmail from './views/VerifyEmail'
import ForgotPassword from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'
import PendingEmailVerification from './views/PendingEmailVerification'

// Componente para proteger rutas por rol
function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAppContext()
  
  // Verificar si el usuario tiene un rol permitido
  if (!user?.rol || !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
    if (user?.rol === 'alumno') {
      return <Navigate to="/mis-rutinas" replace />
    }
    return <Navigate to="/alumnos" replace />
  }
  
  return children
}

// Layout para rutas autenticadas
function AuthenticatedLayout() {
  const { user } = useAppContext()

  return (
    <div className="flex h-screen bg-background">
      <Header />
      {user && <Sidebar />}
      
      <main className={`flex-1 ${user ? 'md:ml-64' : ''} overflow-y-auto pt-16`}>
        <div className="max-w-7xl mx-auto">
          <Routes>
            {/* Rutas exclusivas para alumnos */}
            <Route 
              path="/mis-rutinas" 
              element={
                <RoleProtectedRoute allowedRoles={['alumno']}>
                  <StudentRoutines />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/mi-progreso" 
              element={
                <RoleProtectedRoute allowedRoles={['alumno']}>
                  <StudentProgress />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Rutas exclusivas para coaches/profesores */}
            <Route 
              path="/alumnos" 
              element={
                <RoleProtectedRoute allowedRoles={['profesora', 'coach']}>
                  <StudentList />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/alumnos/:id" 
              element={
                <RoleProtectedRoute allowedRoles={['profesora', 'coach']}>
                  <StudentDetail />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/rutinas" 
              element={
                <RoleProtectedRoute allowedRoles={['profesora', 'coach']}>
                  <RoutineBuilder />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/agregar-alumno" 
              element={
                <RoleProtectedRoute allowedRoles={['profesora', 'coach']}>
                  <AddStudent />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/agregar-ejercicio" 
              element={
                <RoleProtectedRoute allowedRoles={['profesora', 'coach']}>
                  <AddExercise />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Rutas compartidas por todos los roles autenticados */}
            <Route path="/perfil" element={<Profile />} />
            
            {/* Redirección por defecto según rol */}
            <Route path="*" element={<DefaultRedirect />} />
          </Routes>
        </div>
      </main>

      <BottomNavbar />
    </div>
  )
}

// Componente para redirección por defecto según rol
function DefaultRedirect() {
  const { user } = useAppContext()
  
  if (user?.rol === 'alumno') {
    return <Navigate to="/mis-rutinas" replace />
  }
  
  return <Navigate to="/alumnos" replace />
}

// Componente principal con rutas
function AppContent() {
  const { isAuthenticated, user, pendingEmailData, setNavigationCallback } = useAppContext()
  const navigate = useNavigate()

  // Establecer el callback de navegación en el contexto
  useEffect(() => {
    setNavigationCallback(() => navigate)
  }, [navigate, setNavigationCallback])

  // Si no está autenticado, mostrar rutas públicas
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pending-verification" element={
          <PendingEmailVerification 
            email={pendingEmailData?.email || ''}
            nombre={pendingEmailData?.nombre || ''}
          />
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Si está autenticado, mostrar rutas protegidas
  return <AuthenticatedLayout />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  )
}
