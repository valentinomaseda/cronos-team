import { pool } from '../config/database.js';

export class Ejercicio {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM ejercicio');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM ejercicio WHERE idEjercicio = ?', [id]);
    return rows[0];
  }

  static async findByName(nombre) {
    const [rows] = await pool.query(
      'SELECT * FROM ejercicio WHERE nombre LIKE ?',
      [`%${nombre}%`]
    );
    return rows;
  }

  static async create(ejercicioData) {
    const { 
      idEjercicio, 
      nombre, 
      tipoContador,
      unidad,
      distancia,
      duracion,
      descripcionIntervalo
    } = ejercicioData;
    
    const [result] = await pool.query(
      `INSERT INTO ejercicio 
       (idEjercicio, nombre, tipoContador, unidad, distancia, duracion, descripcionIntervalo) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idEjercicio, 
        nombre, 
        tipoContador || 'reps',
        unidad || 'reps',
        distancia || null,
        duracion || null,
        descripcionIntervalo || null
      ]
    );
    return result;
  }

  static async update(id, ejercicioData) {
    const fields = [];
    const values = [];
    
    Object.keys(ejercicioData).forEach(key => {
      if (ejercicioData[key] !== undefined && key !== 'idEjercicio') {
        fields.push(`${key} = ?`);
        values.push(ejercicioData[key]);
      }
    });
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE ejercicio SET ${fields.join(', ')} WHERE idEjercicio = ?`,
      values
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM ejercicio WHERE idEjercicio = ?', [id]);
    return result;
  }

  // Obtener rutinas que incluyen este ejercicio
  static async getRutinas(idEjercicio) {
    const [rows] = await pool.query(
      `SELECT r.* FROM rutina r
       INNER JOIN rutina_ejercicio re ON r.idRutina = re.idRutina
       WHERE re.idEjercicio = ?`,
      [idEjercicio]
    );
    return rows;
  }
}
