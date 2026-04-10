import express from 'express';
import { tipoEjercicioController } from '../controllers/tipoEjercicioController.js';

const router = express.Router();

// Rutas de tipos de ejercicio
router.get('/', tipoEjercicioController.getAll);
router.get('/:id', tipoEjercicioController.getById);
router.post('/', tipoEjercicioController.create);
router.put('/:id', tipoEjercicioController.update);
router.delete('/:id', tipoEjercicioController.delete);

export default router;
