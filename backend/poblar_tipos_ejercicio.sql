-- Script para poblar la tabla tipo_ejercicio con los tipos de contador
-- Autor: Sistema
-- Fecha: 2026-03-09
-- Descripción: Inserta todos los tipos de ejercicios soportados

USE `adrenalina_extrema`;

-- Insertar todos los tipos de ejercicio (usando INSERT IGNORE para no duplicar)
INSERT IGNORE INTO `tipo_ejercicio` (`idTipoEjercicio`, `nombre`) VALUES
(1, 'reps'),
(2, 'segundos'),
(3, 'minutos'),
(4, 'horas'),
(5, 'km'),
(6, 'metros');

-- Verificar inserción
SELECT * FROM `tipo_ejercicio`;

SELECT 'Tipos de ejercicio actualizados exitosamente' AS mensaje;
