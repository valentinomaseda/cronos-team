import { Ejercicio } from '../models/Ejercicio.js';

export const ejercicioController = {
  // GET /api/ejercicios
  async getAll(req, res) {
    try {
      const ejercicios = await Ejercicio.findAll();
      res.json(ejercicios);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      res.status(500).json({ error: 'Error al obtener ejercicios' });
    }
  },

  // GET /api/ejercicios/:id
  async getById(req, res) {
    try {
      const ejercicio = await Ejercicio.findById(req.params.id);
      if (!ejercicio) {
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
      }
      res.json(ejercicio);
    } catch (error) {
      console.error('Error al obtener ejercicio:', error);
      res.status(500).json({ error: 'Error al obtener ejercicio' });
    }
  },

  // GET /api/ejercicios/search/:nombre
  async search(req, res) {
    try {
      const ejercicios = await Ejercicio.findByName(req.params.nombre);
      res.json(ejercicios);
    } catch (error) {
      console.error('Error al buscar ejercicios:', error);
      res.status(500).json({ error: 'Error al buscar ejercicios' });
    }
  },

  // GET /api/ejercicios/:id/rutinas
  async getRutinas(req, res) {
    try {
      const rutinas = await Ejercicio.getRutinas(req.params.id);
      res.json(rutinas);
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      res.status(500).json({ error: 'Error al obtener rutinas' });
    }
  },

  // POST /api/ejercicios
  async create(req, res) {
    try {
      const result = await Ejercicio.create(req.body);
      res.status(201).json({ 
        message: 'Ejercicio creado exitosamente',
        id: req.body.idEjercicio 
      });
    } catch (error) {
      console.error('Error al crear ejercicio:', error);
      res.status(500).json({ error: 'Error al crear ejercicio' });
    }
  },

  // PUT /api/ejercicios/:id
  async update(req, res) {
    try {
      const result = await Ejercicio.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
      }
      res.json({ message: 'Ejercicio actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      res.status(500).json({ error: 'Error al actualizar ejercicio' });
    }
  },

  // DELETE /api/ejercicios/:id
  async delete(req, res) {
    try {
      const result = await Ejercicio.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
      }
      res.json({ message: 'Ejercicio eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      res.status(500).json({ error: 'Error al eliminar ejercicio' });
    }
  }
};
