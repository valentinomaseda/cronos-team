import { Resend } from 'resend';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { ConfirmEmailHtml } from '../emails/ConfirmEmail.js';
import { ResetPasswordEmailHtml } from '../emails/ResetPasswordEmail.js';

// Inicializar cliente de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Genera un token criptográficamente seguro
 */
function generarToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Guarda un token en la base de datos
 * @param {number} idPersona - ID de la persona
 * @param {string} tipo - Tipo de token ('verificacion' o 'reset_password')
 * @param {number} horasExpiracion - Horas hasta que expire el token
 * @returns {Promise<string>} - El token generado
 */
async function guardarToken(idPersona, tipo, horasExpiracion = 24) {
  const token = generarToken();
  const expiracion = new Date(Date.now() + horasExpiracion * 60 * 60 * 1000);
  
  await pool.query(
    'INSERT INTO auth_tokens (idPersona, token, tipo, expiracion) VALUES (?, ?, ?, ?)',
    [idPersona, token, tipo, expiracion]
  );
  
  return token;
}

/**
 * Valida un token y lo marca como usado
 * @param {string} token - El token a validar
 * @param {string} tipo - El tipo de token esperado
 * @returns {Promise<Object|null>} - Los datos del token si es válido, null si no
 */
async function validarToken(token, tipo) {
  const [rows] = await pool.query(
    `SELECT * FROM auth_tokens 
     WHERE token = ? AND tipo = ? AND usado = FALSE AND expiracion > NOW()`,
    [token, tipo]
  );
  
  if (rows.length === 0) return null;
  
  // Marcar token como usado
  await pool.query(
    'UPDATE auth_tokens SET usado = TRUE WHERE token = ?',
    [token]
  );
  
  return rows[0];
}

/**
 * Invalida todos los tokens de un tipo específico para un usuario
 * @param {number} idPersona - ID de la persona
 * @param {string} tipo - Tipo de token a invalidar
 */
async function invalidarTokens(idPersona, tipo) {
  await pool.query(
    'UPDATE auth_tokens SET usado = TRUE WHERE idPersona = ? AND tipo = ?',
    [idPersona, tipo]
  );
}

/**
 * Envía email de confirmación de registro
 * @param {Object} params - Parámetros del email
 * @param {number} params.idPersona - ID de la persona
 * @param {string} params.email - Email del destinatario
 * @param {string} params.nombre - Nombre del destinatario
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function enviarEmailConfirmacion({ idPersona, email, nombre }) {
  try {
    // Generar token con 24 horas de expiración
    const token = await guardarToken(idPersona, 'verificacion', 24);
    
    // Construir URL de confirmación
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const confirmacionUrl = `${frontendUrl}/verify-email?token=${token}`;
    
    // Generar HTML del email
    const emailHtml = ConfirmEmailHtml(nombre, confirmacionUrl);
    
    // Enviar email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Adrenalina Extrema <contacto@adrenalinaextrema.com>',
      to: [email],
      subject: 'Confirma tu email - Adrenalina Extrema',
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error enviando email de confirmación:', error);
      throw new Error('Error al enviar email de confirmación');
    }
    
    console.log('✓ Email de confirmación enviado:', data.id);
    return { success: true, messageId: data.id };
    
  } catch (error) {
    console.error('Error en enviarEmailConfirmacion:', error);
    throw error;
  }
}

/**
 * Envía email de recuperación de contraseña
 * @param {Object} params - Parámetros del email
 * @param {number} params.idPersona - ID de la persona
 * @param {string} params.email - Email del destinatario
 * @param {string} params.nombre - Nombre del destinatario
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function enviarEmailRecuperacion({ idPersona, email, nombre }) {
  try {
    // Invalidar tokens previos de recuperación
    await invalidarTokens(idPersona, 'reset_password');
    
    // Generar nuevo token con 1 hora de expiración
    const token = await guardarToken(idPersona, 'reset_password', 1);
    
    // Construir URL de reset
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    
    // Generar HTML del email
    const emailHtml = ResetPasswordEmailHtml(nombre, resetUrl);
    
    // Enviar email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Adrenalina Extrema <contacto@adrenalinaextrema.com>',
      to: [email],
      subject: 'Recuperación de contraseña - Adrenalina Extrema',
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error enviando email de recuperación:', error);
      throw new Error('Error al enviar email de recuperación');
    }
    
    console.log('✓ Email de recuperación enviado:', data.id);
    return { success: true, messageId: data.id };
    
  } catch (error) {
    console.error('Error en enviarEmailRecuperacion:', error);
    throw error;
  }
}

/**
 * Verifica un token de email
 * @param {string} token - El token a verificar
 * @returns {Promise<Object>} - Resultado de la verificación
 */
export async function verificarEmailToken(token) {
  try {
    const tokenData = await validarToken(token, 'verificacion');
    
    if (!tokenData) {
      return { success: false, message: 'Token inválido o expirado' };
    }
    
    // Actualizar persona como email verificado
    await pool.query(
      'UPDATE persona SET email_verificado = TRUE WHERE idPersona = ?',
      [tokenData.idPersona]
    );
    
    return { 
      success: true, 
      message: 'Email verificado exitosamente',
      idPersona: tokenData.idPersona 
    };
    
  } catch (error) {
    console.error('Error en verificarEmailToken:', error);
    throw error;
  }
}

/**
 * Verifica un token de reset de password
 * @param {string} token - El token a verificar
 * @returns {Promise<Object>} - Resultado de la verificación
 */
export async function verificarResetToken(token) {
  try {
    const tokenData = await validarToken(token, 'reset_password');
    
    if (!tokenData) {
      return { success: false, message: 'Token inválido o expirado' };
    }
    
    return { 
      success: true, 
      idPersona: tokenData.idPersona 
    };
    
  } catch (error) {
    console.error('Error en verificarResetToken:', error);
    throw error;
  }
}

export default {
  enviarEmailConfirmacion,
  enviarEmailRecuperacion,
  verificarEmailToken,
  verificarResetToken,
};
