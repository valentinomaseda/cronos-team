import express from 'express';
import { personaController } from '../controllers/personaController.js';
import { authenticateToken, requireRole } from '../middleware/common.js';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/login', personaController.login);
router.post('/register', personaController.register);

// Rutas protegidas - Requieren autenticación
// GET /api/personas/:id/rutinas - Ver rutinas del usuario (cualquier usuario autenticado puede ver sus propias rutinas)
router.get('/:id/rutinas', authenticateToken, personaController.getRutinas);

// GET /api/personas/:id - Ver perfil (cualquier usuario autenticado)
router.get('/:id', authenticateToken, personaController.getById);

// PUT /api/personas/:id - Actualizar perfil (cualquier usuario autenticado puede actualizar su propio perfil)
router.put('/:id', authenticateToken, personaController.update);

// Rutas protegidas solo para profesora/coach
router.get('/', authenticateToken, requireRole('profesora', 'coach'), personaController.getAll);
router.get('/rol/:rol', authenticateToken, requireRole('profesora', 'coach'), personaController.getByRole);
router.post('/', authenticateToken, requireRole('profesora', 'coach'), personaController.create);
router.delete('/:id', authenticateToken, requireRole('profesora', 'coach'), personaController.delete);

export default router;
