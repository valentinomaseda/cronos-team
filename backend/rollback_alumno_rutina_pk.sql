-- =====================================================
-- ROLLBACK: Revertir cambios de PRIMARY KEY
-- =====================================================
-- Propósito: Volver a la estructura anterior si hay problemas
-- Solo usar si la migración causa problemas
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

USE adrenalina_extrema;

SELECT 'INICIANDO ROLLBACK...' AS '';

-- =====================================================
-- PASO 1: Eliminar foreign key
-- =====================================================
ALTER TABLE alumno_rutina_ejercicio 
DROP FOREIGN KEY fk_are_alumno_rutina;

-- =====================================================
-- PASO 2: Eliminar UNIQUE KEY
-- =====================================================
ALTER TABLE alumno_rutina_ejercicio 
DROP INDEX uk_alumno_rutina_orden;

-- =====================================================
-- PASO 3: Eliminar columna fechaAsignacion de alumno_rutina_ejercicio
-- =====================================================
ALTER TABLE alumno_rutina_ejercicio 
DROP COLUMN fechaAsignacion;

-- =====================================================
-- PASO 4: Revertir PRIMARY KEY a estructura simple
-- =====================================================
ALTER TABLE alumno_rutina 
DROP PRIMARY KEY;

ALTER TABLE alumno_rutina 
ADD PRIMARY KEY (idPersona, idRutina);

-- =====================================================
-- PASO 5: Recrear foreign key simple
-- =====================================================
ALTER TABLE alumno_rutina_ejercicio 
ADD CONSTRAINT fk_are_alumno_rutina 
  FOREIGN KEY (idPersona, idRutina) 
  REFERENCES alumno_rutina (idPersona, idRutina) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- =====================================================
-- PASO 6: Recrear UNIQUE KEY simple
-- =====================================================
ALTER TABLE alumno_rutina_ejercicio 
ADD UNIQUE KEY uk_alumno_rutina_orden (idPersona, idRutina, orden);

SET FOREIGN_KEY_CHECKS=1;

SELECT '✓ ROLLBACK COMPLETADO' AS mensaje;
