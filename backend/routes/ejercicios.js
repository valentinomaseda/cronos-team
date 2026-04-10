import express from 'express';
import { ejercicioController } from '../controllers/ejercicioController.js';
import { authenticateToken, requireRole } from '../middleware/common.js';

const router = express.Router();

// Rutas de ejercicios - Lectura requiere autenticación, modificación requiere ser profesora/coach
router.get('/', authenticateToken, ejercicioController.getAll);
router.get('/:id', authenticateToken, ejercicioController.getById);
router.get('/search/:nombre', authenticateToken, ejercicioController.search);
router.get('/:id/rutinas', authenticateToken, ejercicioController.getRutinas);

// Solo profesora/coach pueden crear, actualizar o eliminar ejercicios
router.post('/', authenticateToken, requireRole('profesora', 'coach'), ejercicioController.create);
router.put('/:id', authenticateToken, requireRole('profesora', 'coach'), ejercicioController.update);
router.delete('/:id', authenticateToken, requireRole('profesora', 'coach'), ejercicioController.delete);

export default router;
