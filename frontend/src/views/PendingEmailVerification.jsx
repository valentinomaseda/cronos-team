import { useState } from 'react';
import { Mail, Loader2, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingEmailVerification({ email, nombre }) {
  const navigate = useNavigate();
  const [enviandoDeNuevo, setEnviandoDeNuevo] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const reenviarEmail = async () => {
    setEnviandoDeNuevo(true);
    setEmailEnviado(false);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailEnviado(true);
      } else {
        alert(data.message || 'Error al enviar email');
      }
    } catch (error) {
      console.error('Error reenviando email:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setEnviandoDeNuevo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-35 h-35 bg-gradient-to-br from-[#00BFFF] to-[#1E40AF] rounded-full mb-4 shadow-2xl">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-black text-[#F3F4F6] mb-2">
            Verifica tu Email
          </h1>
          <p className="text-lg text-gray-400">Revisa tu bandeja de entrada</p>
        </div>

        {/* Card Principal */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-2xl shadow-2xl p-8 border-2 border-[#00BFFF]">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#00BFFF]/20 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-[#00BFFF]" />
            </div>
          </div>

          {/* Mensaje Principal */}
          <div className="text-center space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-[#F3F4F6]">
              ¡Hola {nombre || 'Usuario'}!
            </h2>
            <p className="text-gray-300 text-lg">
              Hemos enviado un correo de verificación a:
            </p>
            <p className="text-[#00BFFF] font-semibold text-lg break-all">
              {email}
            </p>
            <p className="text-gray-400 text-sm">
              Haz clic en el enlace del correo para activar tu cuenta y poder iniciar sesión.
            </p>
          </div>

          {/* Mensaje de éxito si se reenvió */}
          {emailEnviado && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">
                ¡Email reenviado! Revisa tu bandeja de entrada.
              </p>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="space-y-3">
            {/* Botón Reenviar Email */}
            <button
              onClick={reenviarEmail}
              disabled={enviandoDeNuevo}
              className="w-full flex items-center justify-center gap-2 bg-[#00BFFF] hover:bg-[#0299CC] text-[#0F172A] font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
            >
              {enviandoDeNuevo ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Reenviar Email de Verificación</span>
                </>
              )}
            </button>

            {/* Botón Volver al Login */}
            <button
              onClick={() => {
                // Limpiar la URL si hay un token
                window.history.replaceState({}, document.title, '/');
                if (navigate) {
                  navigate('/login');
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#1a2332] text-[#F3F4F6] font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 border border-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Login</span>
            </button>
          </div>

          {/* Nota adicional */}
          <div className="mt-6 p-4 bg-[#111827] rounded-lg">
            <p className="text-gray-400 text-sm text-center">
              <strong className="text-gray-300">Nota:</strong> Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            ¿Problemas con la verificación?{' '}
            <button
              onClick={() => alert('Contacta a soporte: valentinomaseda@outlook.com')}
              className="text-[#00BFFF] hover:underline font-semibold"
            >
              Contacta Soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
