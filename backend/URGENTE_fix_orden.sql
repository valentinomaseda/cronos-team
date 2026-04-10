-- =====================================================
-- SCRIPT URGENTE: Asignar orden único a ejercicios
-- =====================================================
-- PROBLEMA: Ejercicios repetidos tienen orden = NULL, 
--           causando que se actualicen todos juntos
-- SOLUCIÓN: Asignar orden secuencial a cada ejercicio
-- =====================================================

USE railway;

-- PASO 1: Ver el problema
SELECT 
  '❌ EJERCICIOS SIN ORDEN (PROBLEMA ACTUAL)' as Estado,
  COUNT(*) as Total,
  COUNT(DISTINCT CONCAT(idPersona, '-', idRutina, '-', fechaAsignacion, '-', idEjercicio)) as Grupos
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- PASO 2: Asignar orden desde rutina_ejercicio (si existe)
UPDATE alumno_rutina_ejercicio are
INNER JOIN rutina_ejercicio re 
  ON are.idRutina = re.idRutina 
  AND are.idEjercicio = re.idEjercicio
SET are.orden = re.orden
WHERE are.orden IS NULL 
  AND re.orden IS NOT NULL;

-- Ver progreso
SELECT 
  '⏳ EJERCICIOS AÚN SIN ORDEN' as Estado,
  COUNT(*) as Total
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- PASO 3: Para los que siguen con orden NULL, asignar secuencial
-- Esto usa una subconsulta con ROW_NUMBER para dar orden único
UPDATE alumno_rutina_ejercicio a1
INNER JOIN (
  SELECT 
    idPersona, 
    idRutina, 
    fechaAsignacion,
    idEjercicio,
    @row_num := IF(
      @prev_persona = idPersona AND 
      @prev_rutina = idRutina AND 
      @prev_fecha = fechaAsignacion,
      @row_num + 1,
      1
    ) AS nuevo_orden,
    @prev_persona := idPersona,
    @prev_rutina := idRutina,
    @prev_fecha := fechaAsignacion
  FROM alumno_rutina_ejercicio,
       (SELECT @row_num := 0, @prev_persona := NULL, @prev_rutina := NULL, @prev_fecha := NULL) vars
  WHERE orden IS NULL
  ORDER BY idPersona, idRutina, fechaAsignacion, idEjercicio
) a2 ON a1.idPersona = a2.idPersona 
    AND a1.idRutina = a2.idRutina 
    AND a1.fechaAsignacion = a2.fechaAsignacion
    AND a1.idEjercicio = a2.idEjercicio
SET a1.orden = a2.nuevo_orden
WHERE a1.orden IS NULL;

-- PASO 4: Verificación final (debe retornar 0)
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ SOLUCIONADO - Todos los ejercicios tienen orden'
    ELSE CONCAT('❌ AÚN HAY PROBLEMAS - ', COUNT(*), ' ejercicios sin orden')
  END as Resultado
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- Mostrar ejemplos de los cambios
SELECT 
  '📊 MUESTRA DE EJERCICIOS CORREGIDOS' as '';
  
SELECT 
  p.nombre as Alumno,
  r.nombre as Rutina,
  e.nombre as Ejercicio,
  are.orden as Orden,
  are.cantidad as Cantidad,
  are.fechaAsignacion as FechaAsignacion
FROM alumno_rutina_ejercicio are
INNER JOIN ejercicio e ON are.idEjercicio = e.idEjercicio
INNER JOIN rutina r ON are.idRutina = r.idRutina
INNER JOIN persona p ON are.idPersona = p.idPersona
ORDER BY p.nombre, r.nombre, are.fechaAsignacion, are.orden
LIMIT 20;
