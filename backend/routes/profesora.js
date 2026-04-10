import express from 'express';
import { personaController } from '../controllers/personaController.js';
import { authenticateToken, requireRole } from '../middleware/common.js';

const router = express.Router();

// GET /api/profesora/alumnos - Obtener alumnos con paginación ordenados por última asignación
// Protegido: Solo profesora o coach
router.get('/alumnos', authenticateToken, requireRole('profesora', 'coach'), personaController.getAlumnosPaginados);

export default router;
