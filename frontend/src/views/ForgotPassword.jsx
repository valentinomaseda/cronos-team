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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#1a2942] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-[#1a2942] rounded-2xl shadow-2xl p-8 border border-[#1E40AF]">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Email Enviado</h2>
                <p className="text-gray-300">
                  Si existe una cuenta con el email <span className="font-semibold text-[#00BFFF]">{email}</span>, 
                  recibirás instrucciones para restablecer tu contraseña.
                </p>
                <div className="pt-4">
                  <div className="bg-[#1E40AF] rounded-lg p-4 text-sm text-gray-200">
                    <p className="font-semibold mb-2">📧 Revisa tu bandeja de entrada</p>
                    <p>El enlace de recuperación expirará en 1 hora.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-[#0a0e1a] font-bold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95"
              >
                Volver al Login
              </button>

              <button
                onClick={() => setEstado('formulario')}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#1a2942] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#1a2942] rounded-2xl shadow-2xl p-8 border border-[#1E40AF]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold racing-sans text-white mb-2">
              RECUPERAR CONTRASEÑA
            </h1>
            <div className="h-1 w-20 bg-[#00BFFF] mx-auto rounded"></div>
            <p className="text-gray-400 mt-4">
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
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

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-[#1E40AF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20 transition-all duration-200"
                  disabled={estado === 'enviando'}
                  autoFocus
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-[#0a0e1a] font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center space-x-2"
            >
              {estado === 'enviando' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Enviar Instrucciones</span>
                </>
              )}
            </button>

            {/* Botón Volver */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center space-x-2 bg-[#1E40AF] hover:bg-[#1e3a8a] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Login</span>
            </button>
          </form>
        </div>

        {/* Info adicional */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            ¿Recordaste tu contraseña?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#00BFFF] hover:underline font-semibold"
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
