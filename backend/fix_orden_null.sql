-- Script para asignar valores de orden a ejercicios existentes que tienen orden = NULL
-- Esto evita que ejercicios repetidos se actualicen todos a la vez

USE railway;

-- Ver cuántos ejercicios tienen orden NULL
SELECT COUNT(*) as ejercicios_sin_orden 
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- Paso 1: Copiar el orden de rutina_ejercicio cuando existe
UPDATE alumno_rutina_ejercicio are
INNER JOIN rutina_ejercicio re 
  ON are.idRutina = re.idRutina 
  AND are.idEjercicio = re.idEjercicio
SET are.orden = re.orden
WHERE are.orden IS NULL 
  AND re.orden IS NOT NULL;

-- Verificar progreso
SELECT COUNT(*) as ejercicios_aun_sin_orden 
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- Paso 2: Para ejercicios que aún tienen orden NULL,
-- usar un UPDATE con subconsulta para asignar números secuenciales por grupo
UPDATE alumno_rutina_ejercicio a1
JOIN (
  SELECT 
    idPersona, 
    idRutina, 
    fechaAsignacion,
    idEjercicio,
    ROW_NUMBER() OVER (
      PARTITION BY idPersona, idRutina, fechaAsignacion 
      ORDER BY idEjercicio
    ) as nuevo_orden
  FROM alumno_rutina_ejercicio
  WHERE orden IS NULL
) a2 ON a1.idPersona = a2.idPersona 
    AND a1.idRutina = a2.idRutina 
    AND a1.fechaAsignacion = a2.fechaAsignacion
    AND a1.idEjercicio = a2.idEjercicio
SET a1.orden = a2.nuevo_orden
WHERE a1.orden IS NULL;

-- Verificar que ya no hay ejercicios con orden NULL
SELECT COUNT(*) as ejercicios_sin_orden 
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- Mostrar algunos ejemplos de los cambios
SELECT 
  are.idPersona,
  are.idRutina,
  are.idEjercicio,
  e.nombre as ejercicio_nombre,
  are.orden,
  are.fechaAsignacion
FROM alumno_rutina_ejercicio are
INNER JOIN ejercicio e ON are.idEjercicio = e.idEjercicio
ORDER BY are.idPersona, are.idRutina, are.fechaAsignacion, are.orden
LIMIT 20;
