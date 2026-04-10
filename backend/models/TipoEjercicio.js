import { pool } from '../config/database.js';

export class TipoEjercicio {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM tipo_ejercicio');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tipo_ejercicio WHERE idTipoEjercicio = ?', [id]);
    return rows[0];
  }

  static async create(tipoData) {
    const { idTipoEjercicio, nombre } = tipoData;
    const [result] = await pool.query(
      'INSERT INTO tipo_ejercicio (idTipoEjercicio, nombre) VALUES (?, ?)',
      [idTipoEjercicio, nombre]
    );
    return result;
  }

  static async update(id, tipoData) {
    const { nombre } = tipoData;
    const [result] = await pool.query(
      'UPDATE tipo_ejercicio SET nombre = ? WHERE idTipoEjercicio = ?',
      [nombre, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM tipo_ejercicio WHERE idTipoEjercicio = ?', [id]);
    return result;
  }
}
