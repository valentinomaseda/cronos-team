-- =====================================================
-- MIGRACIÓN: Agregar fechaAsignacion a PRIMARY KEY
-- =====================================================
-- Propósito: Permitir múltiples asignaciones de la misma rutina al mismo alumno
-- IMPORTANTE: Ejecutar en producción con precaución
-- 
-- NOTA: Si falla con "Cannot drop index 'PRIMARY': needed in a foreign key constraint"
-- ejecuta primero: SELECT * FROM information_schema.KEY_COLUMN_USAGE 
-- WHERE REFERENCED_TABLE_NAME='alumno_rutina' AND TABLE_SCHEMA='adrenalina_extrema';
-- para ver qué foreign keys existen y ajustar los nombres.
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

USE adrenalina_extrema;

-- =====================================================
-- PASO 1: Eliminar foreign key en alumno_rutina_ejercicio
-- =====================================================
SELECT 'PASO 1: Eliminando foreign key...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
DROP FOREIGN KEY fk_are_alumno_rutina;

-- =====================================================
-- PASO 2: Eliminar UNIQUE KEY en alumno_rutina_ejercicio
-- =====================================================
SELECT 'PASO 2: Eliminando UNIQUE KEY...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
DROP INDEX uk_alumno_rutina_orden;

-- =====================================================
-- PASO 3: Eliminar foreign keys que salen de alumno_rutina
-- =====================================================
SELECT 'PASO 3: Eliminando foreign keys de alumno_rutina...' AS '';

ALTER TABLE alumno_rutina 
DROP FOREIGN KEY fk_alumno_rutina_alumno;

ALTER TABLE alumno_rutina 
DROP FOREIGN KEY fk_alumno_rutina_rutina;

-- =====================================================
-- PASO 4: Modificar PRIMARY KEY en alumno_rutina
-- =====================================================
SELECT 'PASO 4: Modificando PRIMARY KEY en alumno_rutina...' AS '';

-- Eliminar PRIMARY KEY actual
ALTER TABLE alumno_rutina 
DROP PRIMARY KEY;

-- Agregar nueva PRIMARY KEY con fechaAsignacion
ALTER TABLE alumno_rutina 
ADD PRIMARY KEY (idPersona, idRutina, fechaAsignacion);

-- =====================================================
-- PASO 5: Recrear foreign keys en alumno_rutina
-- =====================================================
SELECT 'PASO 5: Recreando foreign keys en alumno_rutina...' AS '';

ALTER TABLE alumno_rutina 
ADD CONSTRAINT fk_alumno_rutina_alumno 
  FOREIGN KEY (idPersona) 
  REFERENCES persona (idPersona) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE alumno_rutina 
ADD CONSTRAINT fk_alumno_rutina_rutina 
  FOREIGN KEY (idRutina) 
  REFERENCES rutina (idRutina) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- =====================================================
-- PASO 6: Agregar columna fechaAsignacion a alumno_rutina_ejercicio
-- =====================================================
SELECT 'PASO 6: Agregando columna fechaAsignacion...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
ADD COLUMN fechaAsignacion DATETIME NOT NULL AFTER idRutina;

-- =====================================================
-- PASO 7: Sincronizar fechas desde alumno_rutina
-- =====================================================
SELECT 'PASO 7: Sincronizando fechas...' AS '';

UPDATE alumno_rutina_ejercicio are 
JOIN alumno_rutina ar ON are.idPersona = ar.idPersona AND are.idRutina = ar.idRutina 
SET are.fechaAsignacion = ar.fechaAsignacion;

-- =====================================================
-- PASO 8: Recrear foreign key en alumno_rutina_ejercicio
-- =====================================================
SELECT 'PASO 8: Recreando foreign key...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
ADD CONSTRAINT fk_are_alumno_rutina 
  FOREIGN KEY (idPersona, idRutina, fechaAsignacion) 
  REFERENCES alumno_rutina (idPersona, idRutina, fechaAsignacion) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- =====================================================
-- PASO 9: Recrear UNIQUE KEY en alumno_rutina_ejercicio
-- =====================================================
SELECT 'PASO 9: Recreando UNIQUE KEY...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
ADD UNIQUE KEY uk_alumno_rutina_orden (idPersona, idRutina, fechaAsignacion, orden);

-- =====================================================
-- PASO 10: Actualizar índice
-- =====================================================
SELECT 'PASO 10: Actualizando índice...' AS '';

ALTER TABLE alumno_rutina_ejercicio 
DROP INDEX idx_alumno_rutina_ejercicio, 
ADD INDEX idx_alumno_rutina_ejercicio (idPersona, idRutina, fechaAsignacion, idEjercicio);

-- =====================================================
-- PASO 11: Restaurar verificación de foreign keys
-- =====================================================
SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT '✓ MIGRACIÓN COMPLETADA EXITOSAMENTE' AS mensaje;

-- Verificar datos existentes
SELECT COUNT(*) as total_asignaciones FROM alumno_rutina;
SELECT COUNT(*) as total_ejercicios_personalizados FROM alumno_rutina_ejercicio;
