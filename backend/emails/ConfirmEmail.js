// backend/emails/ConfirmEmail.js

export const ConfirmEmailHtml = (nombre, confirmacionUrl) => {
  // Estilos basados en la identidad de Adrenalina Extrema
  const colors = {
    brand: '#00BFFF',    // cyan - color principal
    secondary: '#1E40AF', // blue - color secundario
    bg: '#0a0e1a',       // dark background
    card: '#1a2942',     // card background
    text: '#F3F4F6',     // light text
    muted: '#9CA3AF'     // gray text
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirma tu email - Adrenalina Extrema</title>
    </head>
    <body style="background-color: ${colors.bg}; font-family: sans-serif; margin: 0; padding: 40px 10px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${colors.card}; border-radius: 16px; overflow: hidden; border: 2px solid ${colors.secondary};">
        <tr>
          <td style="background: linear-gradient(135deg, ${colors.brand}, ${colors.secondary}); padding: 30px; text-align: center;">
            <h1 style="color: ${colors.text}; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px;">
              ADRENALINA EXTREMA
            </h1>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: ${colors.text}; font-size: 24px; margin-bottom: 20px;">¡Bienvenido, ${nombre}!</h2>
            <p style="color: ${colors.text}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Gracias por sumarte al equipo. Para empezar a recibir tus planes de entrenamiento y seguir tu progreso, necesitamos verificar tu cuenta.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmacionUrl}" style="background-color: ${colors.brand}; color: ${colors.bg}; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; letter-spacing: 1px;">
                CONFIRMAR MI CUENTA
              </a>
            </div>

            <p style="color: ${colors.muted}; font-size: 14px; margin-top: 40px;">
              Si el botón no funciona, copia y pega este enlace:<br>
              <a href="${confirmacionUrl}" style="color: ${colors.brand}; text-decoration: underline; font-size: 12px; word-break: break-all;">
                ${confirmacionUrl}
              </a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding: 20px 30px; text-align: center; border-top: 1px solid ${colors.secondary};">
            <p style="color: ${colors.muted}; font-size: 14px; margin: 0 0 10px 0;">
              © 2026 Adrenalina Extrema. Todos los derechos reservados.
            </p>
            <p style="color: ${colors.muted}; font-size: 12px; margin: 0;">
              Sistema de Gestión Deportiva.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};