-- =====================================================
-- MIGRACIÓN: Mejoras en alumno_rutina_ejercicio
-- =====================================================
-- Fecha: 2026-03-11
-- Descripción: 
--   1. Permite valores decimales en cantidad (ej: 5.9 km, 10.5 metros)
--   2. Agrega campo para marcar ejercicios completados
--   3. Agrega campo para feedback del alumno por ejercicio
-- =====================================================

USE `railway`;

-- 1. Modificar campo cantidad en rutina_ejercicio
ALTER TABLE `rutina_ejercicio` 
MODIFY COLUMN `cantidad` DECIMAL(10, 2) NOT NULL DEFAULT 10.00;

-- 2. Modificar campo cantidad en alumno_rutina_ejercicio
ALTER TABLE `alumno_rutina_ejercicio` 
MODIFY COLUMN `cantidad` DECIMAL(10, 2) NOT NULL DEFAULT 10.00;

-- 3. Agregar campo para marcar ejercicio completado
ALTER TABLE `alumno_rutina_ejercicio`
ADD COLUMN `ejercicioCompletado` BOOLEAN DEFAULT FALSE AFTER `esCalentamiento`;

-- 4. Agregar campo para feedback del alumno
ALTER TABLE `alumno_rutina_ejercicio`
ADD COLUMN `feedbackAlumno` TEXT DEFAULT NULL AFTER `ejercicioCompletado`;

-- Verificar cambios
DESCRIBE rutina_ejercicio;
DESCRIBE alumno_rutina_ejercicio;

SELECT 'Migración completada exitosamente:' AS '';
SELECT '✓ cantidad ahora acepta decimales (DECIMAL 10,2)' AS Cambios;
SELECT '✓ ejercicioCompletado agregado (BOOLEAN)' AS '';
SELECT '✓ feedbackAlumno agregado (TEXT)' AS '';

