import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState('verificando'); // 'verificando', 'exito', 'error'
  const [mensaje, setMensaje] = useState('');
  const [enviandoDeNuevo, setEnviandoDeNuevo] = useState(false);

  useEffect(() => {
    const verificarEmail = async () => {
      // Obtener token de la URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setEstado('error');
        setMensaje('Token no proporcionado');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setEstado('exito');
          setMensaje(data.message);
        } else {
          setEstado('error');
          setMensaje(data.message || 'Error al verificar el email');
        }
      } catch (error) {
        console.error('Error verificando email:', error);
        setEstado('error');
        setMensaje('Error de conexión. Por favor, intenta de nuevo.');
      }
    };

    verificarEmail();
  }, []);

  const reenviarEmail = async () => {
    setEnviandoDeNuevo(true);
    try {
      const email = prompt('Ingresa tu email para reenviar el correo de verificación:');
      if (!email) {
        setEnviandoDeNuevo(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Email de verificación enviado. Por favor, revisa tu bandeja de entrada.');
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
      <div className="max-w-md w-full">
        <div className="auth-card p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-on-dark mb-2">
              VERIFICACIÓN DE EMAIL
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
          </div>

          {/* Estado de verificación */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {estado === 'verificando' && (
              <>
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-spin" />
                <p className="text-base sm:text-lg text-gray-300">Verificando tu email...</p>
              </>
            )}

            {estado === 'exito' && (
              <>
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                <div className="text-center space-y-4 w-full">
                  <p className="text-lg sm:text-xl font-bold text-text-on-dark">¡Email Verificado!</p>
                  <p className="text-sm sm:text-base text-gray-300">{mensaje}</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-4 px-6 py-3 btn-primary"
                  >
                    Ir al Login
                  </button>
                </div>
              </>
            )}

            {estado === 'error' && (
              <>
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
                <div className="text-center space-y-3 w-full">
                  <p className="text-lg sm:text-xl font-bold text-text-on-dark">Error de Verificación</p>
                  <p className="text-sm sm:text-base text-gray-300 px-2">{mensaje}</p>
                  
                  {/* Botones de acción */}
                  <div className="flex flex-col space-y-2 sm:space-y-3 mt-4 sm:mt-6 w-full px-2">
                    <button
                      onClick={reenviarEmail}
                      disabled={enviandoDeNuevo}
                        className="flex items-center justify-center space-x-2 btn-primary py-2.5 sm:py-3 px-4 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {enviandoDeNuevo ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      <span>Reenviar Email</span>
                    </button>

                    <button
                      onClick={() => navigate('/login')}
                      className="btn-secondary py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base"
                    >
                      Ir al Login
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Link de ayuda */}
        <div className="text-center mt-6">
            <p className="text-sm text-gray-300">
            ¿Necesitas ayuda?{' '}
            <button
              onClick={() => alert('Contacta a soporte@adrenalina-extrema.com')}
              className="text-cyan hover:underline font-semibold"
            >
              Contacta Soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
