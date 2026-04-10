import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [estado, setEstado] = useState('verificando'); // 'verificando', 'formulario', 'procesando', 'exito', 'error'
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Verificar token al cargar
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setEstado('error');
      setError('Token no proporcionado');
      // Limpiar URL
      window.history.replaceState({}, document.title, '/');
      return;
    }

    setToken(tokenParam);
    verificarToken(tokenParam);
  }, []);

  const verificarToken = async (tokenToVerify) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/verify-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEstado('formulario');
      } else {
        setEstado('error');
        setError(data.message || 'Token inválido o expirado');
        // Limpiar URL cuando el token es inválido
        window.history.replaceState({}, document.title, '/');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setEstado('error');
      setError('Error de conexión. Por favor, intenta de nuevo.');
      // Limpiar URL en caso de error
      window.history.replaceState({}, document.title, '/');
    }
  };

  const validarPassword = () => {
    if (!password.trim()) {
      setError('Por favor, ingresa una contraseña');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarPassword()) return;

    setEstado('procesando');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEstado('exito');
        setMensaje(data.message);
        // Limpiar la URL y forzar navegación al root
        window.history.pushState({}, document.title, '/');
      } else {
        setEstado('formulario');
        setError(data.message || 'Error al restablecer contraseña');
      }
    } catch (error) {
      console.error('Error restableciendo contraseña:', error);
      setEstado('formulario');
      setError('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  // Vista de carga
  if (estado === 'verificando') {
    return (
      <div className="auth-shell px-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0697d8] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-300">Verificando token...</p>
        </div>
      </div>
    );
  }

  // Vista de éxito
  if (estado === 'exito') {
    return (
      <div className="auth-shell px-4">
        <div className="max-w-md w-full">
          <div className="auth-card">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-on-dark">¡Contraseña Actualizada!</h2>
                <p className="text-gray-300">{mensaje}</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary"
              >
                Volver al Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de error de token
  if (estado === 'error') {
    return (
      <div className="auth-shell px-4">
        <div className="max-w-md w-full">
          <div className="auth-card">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <XCircle className="w-16 h-16 text-red-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-on-dark">Error</h2>
                <p className="text-gray-300">{error}</p>
              </div>
              <div className="flex flex-col space-y-3 w-full">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="w-full btn-primary"
                >
                  Solicitar Nuevo Enlace
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full btn-secondary"
                >
                  Ir al Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de reset
  return (
    <div className="auth-shell px-4">
      <div className="max-w-md w-full">
        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold racing-sans text-text-on-dark mb-2">
              NUEVA CONTRASEÑA
            </h1>
            <div className="h-1 w-20 bg-[#0697d8] mx-auto rounded"></div>
            <p className="text-gray-400 mt-4">
              Ingresa tu nueva contraseña para tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Nueva Contraseña */}
            <div>
              <label htmlFor="password" className="label-dark">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-11 pr-12 py-3"
                  disabled={estado === 'procesando'}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="label-dark">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={mostrarConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full pl-11 pr-12 py-3"
                  disabled={estado === 'procesando'}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirm(!mostrarConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {mostrarConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Indicador de fortaleza */}
            {password && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Fortaleza de la contraseña:</div>
                <div className="flex space-x-1">
                  <div className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <div className={`h-2 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <div className={`h-2 flex-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                </div>
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={estado === 'procesando'}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {estado === 'procesando' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Restablecer Contraseña</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link de ayuda */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            ¿Problemas?{' '}
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-cyan hover:underline font-semibold"
            >
              Solicitar Nuevo Enlace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
