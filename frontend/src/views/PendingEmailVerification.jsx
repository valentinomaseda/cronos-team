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
    <div className="auth-shell">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-35 h-35 bg-bg-surface rounded-full mb-4 shadow-md border border-border">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="title-screen mb-2">
            Verifica tu Email
          </h1>
          <p className="text-lg text-text-muted">Revisa tu bandeja de entrada</p>
        </div>

        {/* Card Principal */}
        <div className="surface-brand p-8">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-bg rounded-full border border-border flex items-center justify-center">
              <Mail className="text-brandBlue" size={24} strokeWidth={2} />
            </div>
          </div>

          {/* Mensaje Principal */}
          <div className="text-center space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-text">
              ¡Hola {nombre || 'Usuario'}!
            </h2>
            <p className="text-text-muted text-lg">
              Hemos enviado un correo de verificación a:
            </p>
            <p className="text-brandBlue font-semibold text-lg break-all">
              {email}
            </p>
            <p className="text-text-muted text-sm">
              Haz clic en el enlace del correo para activar tu cuenta y poder iniciar sesión.
            </p>
          </div>

          {/* Mensaje de éxito si se reenvió */}
          {emailEnviado && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-success flex-shrink-0" size={24} strokeWidth={2} />
              <p className="text-success text-sm">
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
              className="w-full flex items-center justify-center gap-2 btn-primary py-3 active:scale-95 transition-transform touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviandoDeNuevo ? (
                <>
                  <Loader2 className="animate-spin" size={24} strokeWidth={2} />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={24} strokeWidth={2} />
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
              className="w-full flex items-center justify-center gap-2 btn-secondary py-3 active:scale-95 transition-transform touch-manipulation"
            >
              <ArrowLeft size={24} strokeWidth={2} />
              <span>Volver al Login</span>
            </button>
          </div>

          {/* Nota adicional */}
          <div className="mt-6 p-4 bg-bg rounded-lg border border-border">
            <p className="text-text-muted text-sm text-center">
              <strong className="text-text">Nota:</strong> Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            ¿Problemas con la verificación?{' '}
            <button
              onClick={() => alert('Contacta a soporte: valentinomaseda@outlook.com')}
              className="text-brandBlue hover:underline font-semibold"
            >
              Contacta Soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
