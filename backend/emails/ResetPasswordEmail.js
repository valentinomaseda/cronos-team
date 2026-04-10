// backend/emails/ResetPasswordEmail.js

export const ResetPasswordEmailHtml = (nombre, resetUrl) => {
  // Estilos basados en la identidad de Adrenalina Extrema
  const colors = {
    brand: '#00BFFF',  // cyan
    secondary: '#1E40AF', // blue
    bg: '#0a0e1a',     // dark bg
    card: '#1a2942',   // card bg
    text: '#F3F4F6',   // light text
    muted: '#9CA3AF',  // gray text
    warning: '#EF4444' // red
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recupera tu contraseña - Adrenalina Extrema</title>
    </head>
    <body style="background-color: ${colors.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 10px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${colors.card}; border-radius: 16px; overflow: hidden; border: 2px solid ${colors.secondary};">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, ${colors.brand}, ${colors.secondary}); padding: 30px; text-align: center;">
            <h1 style="color: ${colors.text}; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px;">
              ADRENALINA EXTREMA
            </h1>
          </td>
        </tr>
        
        <!-- Contenido -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: ${colors.text}; font-size: 24px; margin-bottom: 20px; font-weight: 700;">
              Recuperación de Contraseña
            </h2>
            
            <p style="color: ${colors.text}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hola <strong>${nombre}</strong>,
            </p>
            
            <p style="color: ${colors.text}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este email de forma segura.
            </p>
            
            <p style="color: ${colors.text}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Para crear una nueva contraseña, haz clic en el botón de abajo:
            </p>
            
            <!-- Botón CTA -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background-color: ${colors.brand}; color: ${colors.bg}; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; letter-spacing: 1px;">
                RESTABLECER CONTRASEÑA
              </a>
            </div>
            
            <!-- Warning Box -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.secondary}; border-radius: 8px; margin: 24px 0;">
              <tr>
                <td style="padding: 16px; text-align: center;">
                  <p style="color: ${colors.text}; font-size: 14px; font-weight: 600; margin: 0;">
                    ⚠️ Este enlace expirará en 1 hora por seguridad.
                  </p>
                </td>
              </tr>
            </table>
            
            <p style="color: ${colors.text}; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              O copia y pega este enlace en tu navegador:
            </p>
            <p style="color: ${colors.brand}; font-size: 12px; word-break: break-all; text-decoration: underline;">
              ${resetUrl}
            </p>
            
            <p style="color: ${colors.muted}; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Si no solicitaste restablecer tu contraseña, ignora este email. Tu contraseña permanecerá sin cambios.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px 30px; text-align: center; border-top: 1px solid ${colors.secondary};">
            <p style="color: ${colors.muted}; font-size: 14px; margin: 0 0 10px 0;">
              © 2026 Adrenalina Extrema. Todos los derechos reservados.
            </p>
            <p style="color: ${colors.muted}; font-size: 12px; margin: 0;">
              Por tu seguridad, nunca compartas este enlace con nadie.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default ResetPasswordEmailHtml;
