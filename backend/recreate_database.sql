-- =====================================================
-- SCRIPT DE RECREACIÓN COMPLETA DE BASE DE DATOS
-- =====================================================
-- Fecha: 2026-03-09
-- Descripción: Elimina y recrea todas las tablas con la estructura más reciente
-- ADVERTENCIA: Este script ELIMINA TODOS LOS DATOS EXISTENTES
-- =====================================================

USE `adrenalina_extrema`;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS EXISTENTES
-- =====================================================

DROP TABLE IF EXISTS `auth_tokens`;
DROP TABLE IF EXISTS `alumno_rutina_ejercicio`;
DROP TABLE IF EXISTS `alumno_rutina`;
DROP TABLE IF EXISTS `rutina_ejercicio`;
DROP TABLE IF EXISTS `rutina`;
DROP TABLE IF EXISTS `ejercicio`;
DROP TABLE IF EXISTS `tipo_ejercicio`;
DROP TABLE IF EXISTS `persona`;

-- =====================================================
-- PASO 2: CREAR TABLA TIPO_EJERCICIO
-- =====================================================

CREATE TABLE `tipo_ejercicio` (
  `idTipoEjercicio` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoEjercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insertar tipos de ejercicio
INSERT INTO `tipo_ejercicio` (`idTipoEjercicio`, `nombre`) VALUES
(1, 'reps'),
(2, 'segundos'),
(3, 'minutos'),
(4, 'horas'),
(5, 'km'),
(6, 'metros');

-- =====================================================
-- PASO 3: CREAR TABLA PERSONA
-- =====================================================

CREATE TABLE `persona` (
  `idPersona` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `mail` VARCHAR(100) DEFAULT NULL,
  `tel` VARCHAR(20) NOT NULL,
  `rol` ENUM('coach', 'alumno') NOT NULL DEFAULT 'alumno',
  `cantAlumnos` INT DEFAULT NULL,
  `direccion` VARCHAR(100) DEFAULT NULL,
  `fechaNac` DATE DEFAULT NULL,
  `peso` INT DEFAULT NULL,
  `altura` INT DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  `genero` ENUM('masculino', 'femenino', 'otro') DEFAULT NULL,
  `nivel` ENUM('Principiante', 'Intermedio', 'Avanzado') DEFAULT 'Principiante',
  `email_verificado` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`idPersona`),
  UNIQUE KEY `uk_mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 4: CREAR TABLA AUTH_TOKENS
-- =====================================================

CREATE TABLE `auth_tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPersona` INT UNSIGNED NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `tipo` ENUM('verificacion', 'reset_password') NOT NULL,
  `expiracion` DATETIME NOT NULL,
  `usado` BOOLEAN DEFAULT FALSE,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  KEY `fk_auth_tokens_persona` (`idPersona`),
  CONSTRAINT `fk_auth_tokens_persona` 
    FOREIGN KEY (`idPersona`) 
    REFERENCES `persona` (`idPersona`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 5: CREAR TABLA EJERCICIO
-- =====================================================

CREATE TABLE `ejercicio` (
  `idEjercicio` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `tipoContador` ENUM('reps','segundos') NOT NULL DEFAULT 'reps',
  `unidad` ENUM('reps','segundos','minutos','horas','km','metros') DEFAULT 'reps',
  `distancia` VARCHAR(50) DEFAULT NULL,
  `duracion` VARCHAR(50) DEFAULT NULL,
  `descripcionIntervalo` TEXT DEFAULT NULL,
  PRIMARY KEY (`idEjercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 6: CREAR TABLA RUTINA
-- =====================================================

CREATE TABLE `rutina` (
  `idRutina` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `fechaHoraCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idRutina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 7: CREAR TABLA RUTINA_EJERCICIO (CON ID)
-- =====================================================

CREATE TABLE `rutina_ejercicio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idRutina` INT UNSIGNED NOT NULL,
  `idEjercicio` INT UNSIGNED NOT NULL,
  `cantSets` INT NOT NULL DEFAULT 3,
  `cantidad` INT NOT NULL DEFAULT 10,
  `orden` INT DEFAULT NULL,
  `pausaSeries` VARCHAR(50) DEFAULT NULL,
  `intensidad` TEXT DEFAULT NULL,
  `esCalentamiento` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rutina_orden` (`idRutina`, `orden`),
  KEY `idx_rutina_ejercicio` (`idRutina`, `idEjercicio`),
  KEY `fk_rutina_ejercicio_ejercicio` (`idEjercicio`),
  CONSTRAINT `fk_rutina_ejercicio_ejercicio` 
    FOREIGN KEY (`idEjercicio`) 
    REFERENCES `ejercicio` (`idEjercicio`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rutina_ejercicio_rutina` 
    FOREIGN KEY (`idRutina`) 
    REFERENCES `rutina` (`idRutina`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 8: CREAR TABLA ALUMNO_RUTINA
-- =====================================================

CREATE TABLE `alumno_rutina` (
  `idPersona` INT UNSIGNED NOT NULL,
  `idRutina` INT UNSIGNED NOT NULL,
  `estado` VARCHAR(45) DEFAULT 'activa',
  `fechaAsignacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idPersona`, `idRutina`, `fechaAsignacion`),
  KEY `fk_alumno_rutina_rutina` (`idRutina`),
  CONSTRAINT `fk_alumno_rutina_alumno` 
    FOREIGN KEY (`idPersona`) 
    REFERENCES `persona` (`idPersona`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_alumno_rutina_rutina` 
    FOREIGN KEY (`idRutina`) 
    REFERENCES `rutina` (`idRutina`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 9: CREAR TABLA ALUMNO_RUTINA_EJERCICIO (CON ID)
-- =====================================================

CREATE TABLE `alumno_rutina_ejercicio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPersona` INT UNSIGNED NOT NULL,
  `idRutina` INT UNSIGNED NOT NULL,
  `fechaAsignacion` DATETIME NOT NULL,
  `idEjercicio` INT UNSIGNED NOT NULL,
  `cantSets` INT NOT NULL DEFAULT 3,
  `cantidad` INT NOT NULL DEFAULT 10,
  `especificaciones` TEXT DEFAULT NULL,
  `orden` INT DEFAULT NULL,
  `pausaSeries` VARCHAR(50) DEFAULT NULL,
  `intensidad` TEXT DEFAULT NULL,
  `esCalentamiento` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_alumno_rutina_orden` (`idPersona`, `idRutina`, `fechaAsignacion`, `orden`),
  KEY `idx_alumno_rutina_ejercicio` (`idPersona`, `idRutina`, `fechaAsignacion`, `idEjercicio`),
  KEY `fk_are_ejercicio` (`idEjercicio`),
  CONSTRAINT `fk_are_alumno_rutina` 
    FOREIGN KEY (`idPersona`, `idRutina`, `fechaAsignacion`) 
    REFERENCES `alumno_rutina` (`idPersona`, `idRutina`, `fechaAsignacion`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_are_ejercicio` 
    FOREIGN KEY (`idEjercicio`) 
    REFERENCES `ejercicio` (`idEjercicio`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PASO 10: RESTAURAR VERIFICACIÓN DE FOREIGN KEYS
-- =====================================================

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT 'Base de datos recreada exitosamente' AS mensaje;

SHOW TABLES;

SELECT '=== ESTRUCTURA DE TABLAS ===' AS '';
DESCRIBE tipo_ejercicio;
DESCRIBE persona;
DESCRIBE auth_tokens;
DESCRIBE ejercicio;
DESCRIBE rutina;
DESCRIBE rutina_ejercicio;
DESCRIBE alumno_rutina;
DESCRIBE alumno_rutina_ejercicio;
