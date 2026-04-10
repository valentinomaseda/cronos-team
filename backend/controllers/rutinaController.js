import { Rutina } from '../models/Rutina.js';

export const rutinaController = {
  // GET /api/rutinas
  async getAll(req, res) {
    try {
      const rutinas = await Rutina.findAll();
      res.json(rutinas);
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      res.status(500).json({ error: 'Error al obtener rutinas' });
    }
  },

  // GET /api/rutinas/:id
  async getById(req, res) {
    try {
      const rutina = await Rutina.findById(req.params.id);
      if (!rutina) {
        return res.status(404).json({ error: 'Rutina no encontrada' });
      }
      res.json(rutina);
    } catch (error) {
      console.error('Error al obtener rutina:', error);
      res.status(500).json({ error: 'Error al obtener rutina' });
    }
  },

  // GET /api/rutinas/:id/full (con ejercicios incluidos)
  async getFullRutina(req, res) {
    try {
      const rutina = await Rutina.getFullRutina(req.params.id);
      if (!rutina) {
        return res.status(404).json({ error: 'Rutina no encontrada' });
      }
      res.json(rutina);
    } catch (error) {
      console.error('Error al obtener rutina completa:', error);
      res.status(500).json({ error: 'Error al obtener rutina' });
    }
  },

  // GET /api/rutinas/:id/ejercicios
  async getEjercicios(req, res) {
    try {
      const ejercicios = await Rutina.getEjercicios(req.params.id);
      res.json(ejercicios);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      res.status(500).json({ error: 'Error al obtener ejercicios' });
    }
  },

  // GET /api/rutinas/:id/alumnos
  async getAlumnos(req, res) {
    try {
      const alumnos = await Rutina.getAlumnos(req.params.id);
      res.json(alumnos);
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      res.status(500).json({ error: 'Error al obtener alumnos' });
    }
  },

  // POST /api/rutinas
  async create(req, res) {
    try {
      const result = await Rutina.create(req.body);
      res.status(201).json({ 
        message: 'Rutina creada exitosamente',
        id: req.body.idRutina 
      });
    } catch (error) {
      console.error('Error al crear rutina:', error);
      res.status(500).json({ error: 'Error al crear rutina' });
    }
  },

  // POST /api/rutinas/:id/ejercicios
  async addEjercicio(req, res) {
    try {
      const ejercicioData = req.body;
      await Rutina.addEjercicio(req.params.id, ejercicioData);
      res.status(201).json({ message: 'Ejercicio agregado a la rutina' });
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      res.status(500).json({ error: 'Error al agregar ejercicio' });
    }
  },

  // DELETE /api/rutinas/:id/ejercicios/:rutinaEjercicioId
  async removeEjercicio(req, res) {
    try {
      await Rutina.removeEjercicio(req.params.rutinaEjercicioId);
      res.json({ message: 'Ejercicio removido de la rutina' });
    } catch (error) {
      console.error('Error al remover ejercicio:', error);
      res.status(500).json({ error: 'Error al remover ejercicio' });
    }
  },

  // POST /api/rutinas/:id/asignar
  async assignToAlumno(req, res) {
    try {
      const { idPersona, estado } = req.body;
      const result = await Rutina.assignToAlumno(req.params.id, idPersona, estado);
      res.status(201).json({ 
        message: 'Rutina asignada al alumno',
        fechaAsignacion: result.fechaAsignacion
      });
    } catch (error) {
      console.error('Error al asignar rutina:', error);
      res.status(500).json({ error: 'Error al asignar rutina' });
    }
  },

  // POST /api/rutinas/:id/desasignar
  async removeFromAlumno(req, res) {
    try {
      const { idPersona } = req.body;
      await Rutina.removeFromAlumno(req.params.id, idPersona);
      res.json({ message: 'Rutina desasignada del alumno' });
    } catch (error) {
      console.error('Error al desasignar rutina:', error);
      res.status(500).json({ error: 'Error al desasignar rutina' });
    }
  },

  // PUT /api/rutinas/:id/estado
  async updateEstado(req, res) {
    try {
      const { idPersona, estado } = req.body;
      await Rutina.updateEstadoAsignacion(req.params.id, idPersona, estado);
      res.json({ message: 'Estado de rutina actualizado' });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  },

  // PUT /api/rutinas/:id
  async update(req, res) {
    try {
      const result = await Rutina.update(req.params.id, req.body);

      // Si se enviaron ejercicios, la operación puede haber sido una sustitución
      // de los ejercicios aunque el UPDATE de la tabla rutina no afectara filas.
      if (Array.isArray(req.body.exercises)) {
        return res.json({ message: 'Rutina actualizada exitosamente' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Rutina no encontrada' });
      }
      res.json({ message: 'Rutina actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar rutina:', error);
      res.status(500).json({ error: 'Error al actualizar rutina' });
    }
  },

  // DELETE /api/rutinas/:id
  async delete(req, res) {
    try {
      const result = await Rutina.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Rutina no encontrada' });
      }
      res.json({ message: 'Rutina eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      res.status(500).json({ error: 'Error al eliminar rutina' });
    }
  },

  // ============================================
  // ENDPOINTS DE PERSONALIZACIÓN POR ALUMNO
  // ============================================

  // GET /api/rutinas/:id/alumnos/:idAlumno/ejercicios?fechaAsignacion=...
  async getAlumnoEjercicios(req, res) {
    try {
      const { id, idAlumno } = req.params;
      const { fechaAsignacion } = req.query;
      const ejercicios = await Rutina.getAlumnoEjercicios(id, idAlumno, fechaAsignacion);
      res.json(ejercicios);
    } catch (error) {
      console.error('Error al obtener ejercicios del alumno:', error);
      res.status(500).json({ error: 'Error al obtener ejercicios del alumno' });
    }
  },

  // GET /api/rutinas/:id/alumnos/:idAlumno/full
  async getFullRutinaAlumno(req, res) {
    try {
      const { id, idAlumno } = req.params;
      const rutina = await Rutina.getFullRutinaAlumno(id, idAlumno);
      if (!rutina) {
        return res.status(404).json({ error: 'Rutina no encontrada para este alumno' });
      }
      res.json(rutina);
    } catch (error) {
      console.error('Error al obtener rutina del alumno:', error);
      res.status(500).json({ error: 'Error al obtener rutina del alumno' });
    }
  },

  // PUT /api/rutinas/:id/alumnos/:idAlumno/ejercicios/:idEjercicio?fechaAsignacion=...&orden=...
  async updateAlumnoEjercicio(req, res) {
    try {
      const { id, idAlumno, idEjercicio } = req.params;
      const { fechaAsignacion, orden } = req.query;
      const updates = req.body;
      const result = await Rutina.updateAlumnoEjercicio(idAlumno, id, idEjercicio, updates, fechaAsignacion, orden);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado para este alumno' });
      }
      res.json({ message: 'Ejercicio del alumno actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar ejercicio del alumno:', error);
      res.status(500).json({ error: error.message || 'Error al actualizar ejercicio del alumno' });
    }
  },

  // POST /api/rutinas/:id/alumnos/:idAlumno/ejercicios
  async addAlumnoEjercicio(req, res) {
    try {
      const { id, idAlumno } = req.params;
      const ejercicioData = req.body;
      await Rutina.addAlumnoEjercicio(idAlumno, id, ejercicioData);
      res.status(201).json({ message: 'Ejercicio agregado al alumno exitosamente' });
    } catch (error) {
      console.error('Error al agregar ejercicio al alumno:', error);
      res.status(500).json({ error: 'Error al agregar ejercicio al alumno' });
    }
  },

  // DELETE /api/rutinas/:id/alumnos/:idAlumno/ejercicios/:idEjercicio
  async removeAlumnoEjercicio(req, res) {
    try {
      const { id, idAlumno, idEjercicio } = req.params;
      const result = await Rutina.removeAlumnoEjercicio(idAlumno, id, idEjercicio);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado para este alumno' });
      }
      res.json({ message: 'Ejercicio removido del alumno exitosamente' });
    } catch (error) {
      console.error('Error al remover ejercicio del alumno:', error);
      res.status(500).json({ error: 'Error al remover ejercicio del alumno' });
    }
  },

  // GET /api/rutinas/:id/alumnos-personalizaciones
  async getAlumnosConPersonalizaciones(req, res) {
    try {
      const { id } = req.params;
      const alumnos = await Rutina.getAlumnosConPersonalizaciones(id);
      res.json(alumnos);
    } catch (error) {
      console.error('Error al obtener alumnos con personalizaciones:', error);
      res.status(500).json({ error: 'Error al obtener alumnos con personalizaciones' });
    }
  }
};
