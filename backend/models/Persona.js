import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class Persona {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM persona');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE idPersona = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE mail = ?', [email]);
    return rows[0];
  }

  static async findByRole(rol) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE rol = ?', [rol]);
    return rows;
  }

  static async create(personaData) {
    const { idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero } = personaData;
    
    // Hashear la contraseña
    // Si no se proporciona password (profesor registra alumno), usar '123456' por defecto
    const passwordToHash = password || '123456';
    const hashedPassword = await bcrypt.hash(passwordToHash, SALT_ROUNDS);
    
    const [result] = await pool.query(
      `INSERT INTO persona (idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, hashedPassword, nivel || 'Intermedio', genero || 'masculino']
    );
    return result;
  }

  static async update(id, personaData) {
    // Si se está intentando cambiar la contraseña, validar la actual primero
    if (personaData.newPassword) {
      if (!personaData.currentPassword) {
        throw new Error('Contraseña actual requerida para cambiar la contraseña');
      }
      
      // Obtener el usuario actual
      const usuario = await this.findById(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      // Verificar la contraseña actual
      const isValid = await bcrypt.compare(personaData.currentPassword, usuario.password);
      if (!isValid) {
        throw new Error('La contraseña actual es incorrecta');
      }
      
      // Hashear la nueva contraseña
      personaData.password = await bcrypt.hash(personaData.newPassword, SALT_ROUNDS);
      
      // Eliminar campos temporales
      delete personaData.currentPassword;
      delete personaData.newPassword;
    }
    
    const fields = [];
    const values = [];
    
    Object.keys(personaData).forEach(key => {
      if (personaData[key] !== undefined && key !== 'idPersona' && key !== 'currentPassword' && key !== 'newPassword') {
        fields.push(`${key} = ?`);
        values.push(personaData[key]);
      }
    });
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE persona SET ${fields.join(', ')} WHERE idPersona = ?`,
      values
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM persona WHERE idPersona = ?', [id]);
    return result;
  }

  // Obtener rutinas asignadas a un alumno
  static async getRutinasAsignadas(idPersona) {
    const [rows] = await pool.query(
      `SELECT r.*, ar.estado, ar.fechaAsignacion 
       FROM rutina r
       INNER JOIN alumno_rutina ar ON r.idRutina = ar.idRutina
       WHERE ar.idPersona = ?
       ORDER BY ar.fechaAsignacion DESC`,
      [idPersona]
    );
    return rows;
  }

  // Obtener alumnos de un entrenador (si aplica)
  static async getAlumnos(idEntrenador) {
    const [rows] = await pool.query(
      `SELECT * FROM persona WHERE rol = 'alumno'`
    );
    return rows;
  }

  // Obtener alumnos paginados ordenados por última asignación de rutina
  static async getAlumnosPaginados(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Query principal: todos los alumnos con fecha de última asignación
    // Ordenamiento: PRIMERO los que tienen asignación más reciente, LUEGO los que nunca tuvieron
    const [rows] = await pool.query(
      `SELECT 
        p.idPersona,
        p.nombre,
        p.mail,
        p.tel,
        p.nivel,
        p.genero,
        p.fechaNac,
        p.peso,
        p.altura,
        p.direccion,
        MAX(ar.fechaAsignacion) AS ultima_asignacion,
        CASE 
          WHEN ar_active.idPersona IS NULL THEN 1
          ELSE 0
        END AS necesita_rutina
      FROM persona p
      LEFT JOIN alumno_rutina ar ON p.idPersona = ar.idPersona
      LEFT JOIN (
        SELECT DISTINCT idPersona
        FROM alumno_rutina
        WHERE estado IN ('activa', 'incompleta')
           OR (estado = 'completada' AND fechaAsignacion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY))
      ) ar_active ON p.idPersona = ar_active.idPersona
      WHERE p.rol = 'alumno'
      GROUP BY p.idPersona
      ORDER BY ultima_asignacion DESC, p.nombre ASC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return rows;
  }

  // Obtener total de alumnos (para metadata de paginación)
  static async getAlumnosCount() {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total FROM persona WHERE rol = 'alumno'`
    );
    return rows[0].total;
  }

  // Método de autenticación con bcrypt
  static async authenticate(email, password) {
    const persona = await this.findByEmail(email);
    
    if (!persona) {
      return { success: false, error: 'INVALID_CREDENTIALS' };
    }

    // Verificar la contraseña hasheada
    const isValid = await bcrypt.compare(password, persona.password);
    
    if (!isValid) {
      return { success: false, error: 'INVALID_CREDENTIALS' };
    }

    // Verificar si el email está verificado
    if (!persona.email_verificado) {
      return { 
        success: false, 
        error: 'EMAIL_NOT_VERIFIED',
        email: persona.mail,
        nombre: persona.nombre
      };
    }

    // Retornar persona sin el password
    const { password: _, ...personaSinPassword } = persona;
    return { success: true, persona: personaSinPassword };
  }

  // Método para "reclamar" una cuenta existente con contraseña por defecto
  static async claimAccount(email, password) {
    const persona = await this.findByEmail(email);
    
    // Verificar si existe
    if (!persona) {
      return null;
    }

    // Verificar si tiene la contraseña por defecto '123456'
    const hasDefaultPassword = persona.password && 
                               await bcrypt.compare('123456', persona.password);
    
    // Solo se puede reclamar si tiene la contraseña por defecto
    if (!hasDefaultPassword) {
      return null;
    }

    // Actualizar con la nueva contraseña hasheada
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query(
      'UPDATE persona SET password = ? WHERE mail = ?',
      [hashedPassword, email]
    );

    // Retornar persona sin el password
    const { password: _, ...personaSinPassword } = persona;
    return personaSinPassword;
  }
}
