import { TipoEjercicio } from '../models/TipoEjercicio.js';

export const tipoEjercicioController = {
  // GET /api/tipos-ejercicio
  async getAll(req, res) {
    try {
      const tipos = await TipoEjercicio.findAll();
      res.json(tipos);
    } catch (error) {
      console.error('Error al obtener tipos de ejercicio:', error);
      res.status(500).json({ error: 'Error al obtener tipos de ejercicio' });
    }
  },

  // GET /api/tipos-ejercicio/:id
  async getById(req, res) {
    try {
      const tipo = await TipoEjercicio.findById(req.params.id);
      if (!tipo) {
        return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
      }
      res.json(tipo);
    } catch (error) {
      console.error('Error al obtener tipo de ejercicio:', error);
      res.status(500).json({ error: 'Error al obtener tipo de ejercicio' });
    }
  },

  // POST /api/tipos-ejercicio
  async create(req, res) {
    try {
      const result = await TipoEjercicio.create(req.body);
      res.status(201).json({ 
        message: 'Tipo de ejercicio creado exitosamente',
        id: req.body.idTipoEjercicio 
      });
    } catch (error) {
      console.error('Error al crear tipo de ejercicio:', error);
      res.status(500).json({ error: 'Error al crear tipo de ejercicio' });
    }
  },

  // PUT /api/tipos-ejercicio/:id
  async update(req, res) {
    try {
      const result = await TipoEjercicio.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
      }
      res.json({ message: 'Tipo de ejercicio actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar tipo de ejercicio:', error);
      res.status(500).json({ error: 'Error al actualizar tipo de ejercicio' });
    }
  },

  // DELETE /api/tipos-ejercicio/:id
  async delete(req, res) {
    try {
      const result = await TipoEjercicio.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
      }
      res.json({ message: 'Tipo de ejercicio eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar tipo de ejercicio:', error);
      res.status(500).json({ error: 'Error al eliminar tipo de ejercicio' });
    }
  }
};
