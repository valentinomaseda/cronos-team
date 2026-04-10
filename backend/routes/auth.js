import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import { 
  enviarEmailConfirmacion, 
  enviarEmailRecuperacion,
  verificarEmailToken,
  verificarResetToken 
} from '../utils/emailService.js';

const router = express.Router();
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/verify-email
 * Verifica el email de un usuario mediante token
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Token requerido' 
      });
    }
    
    const resultado = await verificarEmailToken(token);
    
    if (resultado.success) {
      return res.json({ 
        success: true,
        message: 'Email verificado correctamente. Ya puedes iniciar sesión.' 
      });
    } else {
      return res.status(400).json(resultado);
    }
    
  } catch (error) {
    console.error('Error en /verify-email:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al verificar el email' 
    });
  }
});

/**
 * POST /api/auth/resend-verification
 * Reenvía el email de verificación
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email requerido' 
      });
    }
    
    // Buscar usuario
    const [rows] = await pool.query(
      'SELECT idPersona, nombre, mail, email_verificado FROM persona WHERE mail = ?',
      [email]
    );
    
    if (rows.length === 0) {
      // Por seguridad, no revelar que el email no existe
      return res.json({ 
        success: true,
        message: 'Si el email existe, recibirás un correo de verificación' 
      });
    }
    
    const usuario = rows[0];
    
    if (usuario.email_verificado) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email ya está verificado' 
      });
    }
    
    // Enviar email
    await enviarEmailConfirmacion({
      idPersona: usuario.idPersona,
      email: usuario.mail,
      nombre: usuario.nombre
    });
    
    return res.json({ 
      success: true,
      message: 'Email de verificación enviado' 
    });
    
  } catch (error) {
    console.error('Error en /resend-verification:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al enviar email de verificación' 
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Inicia el proceso de recuperación de contraseña
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email requerido' 
      });
    }
    
    // Buscar usuario
    const [rows] = await pool.query(
      'SELECT idPersona, nombre, mail FROM persona WHERE mail = ?',
      [email]
    );
    
    // Por seguridad, siempre responder con éxito aunque el email no exista
    if (rows.length === 0) {
      return res.json({ 
        success: true,
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña' 
      });
    }
    
    const usuario = rows[0];
    
    // Enviar email de recuperación
    await enviarEmailRecuperacion({
      idPersona: usuario.idPersona,
      email: usuario.mail,
      nombre: usuario.nombre
    });
    
    return res.json({ 
      success: true,
      message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña' 
    });
    
  } catch (error) {
    console.error('Error en /forgot-password:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al procesar solicitud de recuperación' 
    });
  }
});

/**
 * POST /api/auth/verify-reset-token
 * Verifica si un token de reset es válido (sin consumirlo)
 */
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Token requerido' 
      });
    }
    
    // Verificar token sin marcarlo como usado
    const [rows] = await pool.query(
      `SELECT idPersona FROM auth_tokens 
       WHERE token = ? AND tipo = 'reset_password' AND usado = FALSE AND expiracion > NOW()`,
      [token]
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
    
    return res.json({ 
      success: true,
      message: 'Token válido' 
    });
    
  } catch (error) {
    console.error('Error en /verify-reset-token:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al verificar token' 
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Restablece la contraseña usando un token válido
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Token y nueva contraseña requeridos' 
      });
    }
    
    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Verificar y consumir token
    const resultado = await verificarResetToken(token);
    
    if (!resultado.success) {
      return res.status(400).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
    
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    // Actualizar contraseña
    await pool.query(
      'UPDATE persona SET password = ? WHERE idPersona = ?',
      [hashedPassword, resultado.idPersona]
    );
    
    return res.json({ 
      success: true,
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' 
    });
    
  } catch (error) {
    console.error('Error en /reset-password:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al restablecer contraseña' 
    });
  }
});

export default router;
