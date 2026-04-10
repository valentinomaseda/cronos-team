import express from 'express';
import { rutinaController } from '../controllers/rutinaController.js';
import { authenticateToken, requireRole, requireCoachOrSelf } from '../middleware/common.js';

const router = express.Router();

// Rutas de rutinas - Todas requieren autenticación
// Ver rutinas (cualquier usuario autenticado)
router.get('/', authenticateToken, rutinaController.getAll);
router.get('/:id', authenticateToken, rutinaController.getById);
router.get('/:id/full', authenticateToken, rutinaController.getFullRutina);
router.get('/:id/ejercicios', authenticateToken, rutinaController.getEjercicios);

// Solo profesora/coach pueden crear, asignar, y administrar rutinas
router.get('/:id/alumnos', authenticateToken, requireRole('profesora', 'coach'), rutinaController.getAlumnos);
router.post('/', authenticateToken, requireRole('profesora', 'coach'), rutinaController.create);
router.post('/:id/ejercicios', authenticateToken, requireRole('profesora', 'coach'), rutinaController.addEjercicio);
router.post('/:id/asignar', authenticateToken, requireRole('profesora', 'coach'), rutinaController.assignToAlumno);
router.post('/:id/desasignar', authenticateToken, requireRole('profesora', 'coach'), rutinaController.removeFromAlumno);
router.put('/:id', authenticateToken, requireRole('profesora', 'coach'), rutinaController.update);
router.delete('/:id', authenticateToken, requireRole('profesora', 'coach'), rutinaController.delete);
router.delete('/:id/ejercicios/:rutinaEjercicioId', authenticateToken, requireRole('profesora', 'coach'), rutinaController.removeEjercicio);

// Alumnos pueden actualizar el estado de sus propias rutinas
router.put('/:id/estado', authenticateToken, rutinaController.updateEstado);

// Rutas de personalización por alumno
// GET: Coach puede ver cualquier alumno, o alumno puede ver sus propios datos
router.get('/:id/alumnos-personalizaciones', authenticateToken, requireRole('profesora', 'coach'), rutinaController.getAlumnosConPersonalizaciones);
router.get('/:id/alumnos/:idAlumno/ejercicios', authenticateToken, requireCoachOrSelf, rutinaController.getAlumnoEjercicios);
router.get('/:id/alumnos/:idAlumno/full', authenticateToken, requireCoachOrSelf, rutinaController.getFullRutinaAlumno);
// PUT/POST/DELETE: Solo coaches pueden modificar, EXCEPTO alumno puede actualizar sus propios ejercicios (completado/feedback)
router.put('/:id/alumnos/:idAlumno/ejercicios/:idEjercicio', authenticateToken, requireCoachOrSelf, rutinaController.updateAlumnoEjercicio);
router.post('/:id/alumnos/:idAlumno/ejercicios', authenticateToken, requireRole('profesora', 'coach'), rutinaController.addAlumnoEjercicio);
router.delete('/:id/alumnos/:idAlumno/ejercicios/:idEjercicio', authenticateToken, requireRole('profesora', 'coach'), rutinaController.removeAlumnoEjercicio);

export default router;
