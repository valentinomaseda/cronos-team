import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('formulario'); // 'formulario', 'enviando', 'enviado'
  const [error, setError] = useState('');

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!email.trim()) {
      setError('Por favor, ingresa tu email');
      return;
    }

    if (!validarEmail(email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    setEstado('enviando');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEstado('enviado');
      } else {
        // Aun con error, mostrar mensaje genérico por seguridad
        setEstado('enviado');
      }
    } catch (error) {
      console.error('Error solicitando recuperación:', error);
      setError('Error de conexión. Por favor, intenta de nuevo.');
      setEstado('formulario');
    }
  };

  if (estado === 'enviado') {
    return (
      <div className="auth-shell px-4">
        <div className="max-w-md w-full">
          <div className="auth-card">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <CheckCircle className="text-success" size={24} strokeWidth={2} />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text">Email Enviado</h2>
                <p className="text-text-muted">
                  Si existe una cuenta con el email <span className="font-semibold text-brandBlue">{email}</span>, 
                  recibirás instrucciones para restablecer tu contraseña.
                </p>
                <div className="pt-4">
                  <div className="bg-bg rounded-lg p-4 text-sm text-text-muted border border-border">
                    <p className="font-semibold mb-2">📧 Revisa tu bandeja de entrada</p>
                    <p>El enlace de recuperación expirará en 1 hora.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary py-3 active:scale-95 transition-transform touch-manipulation"
              >
                Volver al Login
              </button>

              <button
                onClick={() => setEstado('formulario')}
                className="text-sm text-text-muted hover:text-text underline"
              >
                ¿No recibiste el email? Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell px-4">
      <div className="max-w-md w-full">
        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold racing-sans text-text mb-2">
              RECUPERAR CONTRASEÑA
            </h1>
            <div className="h-1 w-20 bg-brandBlue mx-auto rounded"></div>
            <p className="text-text-muted mt-4">
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="label-dark">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={24} strokeWidth={2} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-3"
                  disabled={estado === 'enviando'}
                  autoFocus
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="w-full btn-primary py-3 active:scale-95 transition-transform touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {estado === 'enviando' ? (
                <>
                  <Loader2 className="animate-spin" size={24} strokeWidth={2} />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Mail size={24} strokeWidth={2} />
                  <span>Enviar Instrucciones</span>
                </>
              )}
            </button>

            {/* Botón Volver */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center space-x-2 btn-secondary py-3 active:scale-95 transition-transform touch-manipulation"
            >
              <ArrowLeft size={24} strokeWidth={2} />
              <span>Volver al Login</span>
            </button>
          </form>
        </div>

        {/* Info adicional */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            ¿Recordaste tu contraseña?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-brandBlue hover:underline font-semibold"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
