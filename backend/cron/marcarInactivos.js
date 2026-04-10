// Script para marcar automáticamente alumnos inactivos
// Ejecutar diariamente con cron job o task scheduler

import { pool } from '../config/database.js';
import { Persona } from '../models/Persona.js';

const DIAS_INACTIVIDAD = 60; // 60 días sin rutinas

async function ejecutarMarcarInactivos() {
  try {
    console.log(`[${new Date().toISOString()}] Iniciando proceso de marcado de inactivos...`);
    console.log(`Criterio: Sin rutinas asignadas en los últimos ${DIAS_INACTIVIDAD} días`);

    const result = await Persona.marcarInactivos(DIAS_INACTIVIDAD);

    console.log(`✓ Proceso completado: ${result.affectedRows} alumnos marcados como inactivos`);
    
    // Listar alumnos marcados como inactivos
    if (result.affectedRows > 0) {
      const [inactivos] = await pool.query(
        `SELECT idPersona, nombre, mail 
         FROM persona 
         WHERE rol = 'alumno' AND activo = FALSE
         ORDER BY nombre`
      );
      
      console.log('\nAlumnos actualmente inactivos:');
      inactivos.forEach(a => {
        console.log(`  - ${a.nombre} (ID: ${a.idPersona}, Email: ${a.mail})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error al marcar inactivos:', error);
    process.exit(1);
  }
}

// Ejecutar el proceso
ejecutarMarcarInactivos();
