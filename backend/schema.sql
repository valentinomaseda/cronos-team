-- Adrenalina Extrema - MySQL schema
-- Generated from current backend models/routes/controllers

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS cronos_team
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cronos_team;

-- Drop tables in dependency order
DROP TABLE IF EXISTS auth_tokens;
DROP TABLE IF EXISTS alumno_rutina_ejercicio;
DROP TABLE IF EXISTS alumno_rutina;
DROP TABLE IF EXISTS rutina_ejercicio;
DROP TABLE IF EXISTS rutina;
DROP TABLE IF EXISTS ejercicio;
DROP TABLE IF EXISTS tipo_ejercicio;
DROP TABLE IF EXISTS persona;

CREATE TABLE persona (
  idPersona INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  mail VARCHAR(191) NOT NULL,
  tel VARCHAR(30) NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'alumno',
  cantAlumnos INT NULL DEFAULT 0,
  direccion VARCHAR(255) NULL,
  fechaNac DATE NULL,
  peso DECIMAL(6,2) NULL,
  altura DECIMAL(6,2) NULL,
  password VARCHAR(255) NOT NULL,
  nivel VARCHAR(30) NOT NULL DEFAULT 'Intermedio',
  genero VARCHAR(20) NOT NULL DEFAULT 'masculino',
  email_verificado TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idPersona),
  UNIQUE KEY uq_persona_mail (mail),
  KEY idx_persona_rol (rol),
  KEY idx_persona_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tipo_ejercicio (
  idTipoEjercicio INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  PRIMARY KEY (idTipoEjercicio),
  UNIQUE KEY uq_tipo_ejercicio_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ejercicio (
  idEjercicio INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  tipoContador VARCHAR(30) NOT NULL DEFAULT 'reps',
  unidad VARCHAR(30) NOT NULL DEFAULT 'reps',
  distancia DECIMAL(10,2) NULL,
  duracion VARCHAR(80) NULL,
  descripcionIntervalo VARCHAR(255) NULL,
  PRIMARY KEY (idEjercicio),
  KEY idx_ejercicio_nombre (nombre),
  KEY idx_ejercicio_unidad (unidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rutina (
  idRutina INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  fechaHoraCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idRutina),
  KEY idx_rutina_fecha (fechaHoraCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rutina_ejercicio (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idRutina INT NOT NULL,
  idEjercicio INT NOT NULL,
  cantSets INT NOT NULL DEFAULT 3,
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 10,
  orden INT NULL,
  pausaSeries VARCHAR(100) NULL,
  intensidad VARCHAR(100) NULL,
  esCalentamiento TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_re_rutina (idRutina),
  KEY idx_re_ejercicio (idEjercicio),
  KEY idx_re_orden (idRutina, orden),
  CONSTRAINT fk_re_rutina
    FOREIGN KEY (idRutina) REFERENCES rutina(idRutina)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_re_ejercicio
    FOREIGN KEY (idEjercicio) REFERENCES ejercicio(idEjercicio)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE alumno_rutina (
  idPersona INT NOT NULL,
  idRutina INT NOT NULL,
  estado ENUM('activa', 'incompleta', 'completada') NOT NULL DEFAULT 'activa',
  fechaAsignacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idPersona, idRutina, fechaAsignacion),
  KEY idx_ar_rutina_persona (idRutina, idPersona),
  KEY idx_ar_estado_fecha (estado, fechaAsignacion),
  CONSTRAINT fk_ar_persona
    FOREIGN KEY (idPersona) REFERENCES persona(idPersona)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ar_rutina
    FOREIGN KEY (idRutina) REFERENCES rutina(idRutina)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE alumno_rutina_ejercicio (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idPersona INT NOT NULL,
  idRutina INT NOT NULL,
  fechaAsignacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  idEjercicio INT NOT NULL,
  cantSets INT NOT NULL DEFAULT 3,
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 10,
  especificaciones TEXT NULL,
  orden INT NULL,
  pausaSeries VARCHAR(100) NULL,
  intensidad VARCHAR(100) NULL,
  esCalentamiento TINYINT(1) NOT NULL DEFAULT 0,
  ejercicioCompletado TINYINT(1) NOT NULL DEFAULT 0,
  feedbackAlumno TEXT NULL,
  PRIMARY KEY (id),
  KEY idx_are_lookup (idRutina, idPersona, fechaAsignacion, orden),
  KEY idx_are_update (idPersona, idRutina, idEjercicio, fechaAsignacion, orden),
  KEY idx_are_ejercicio (idEjercicio),
  CONSTRAINT fk_are_asignacion
    FOREIGN KEY (idPersona, idRutina, fechaAsignacion)
    REFERENCES alumno_rutina(idPersona, idRutina, fechaAsignacion)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_are_ejercicio
    FOREIGN KEY (idEjercicio) REFERENCES ejercicio(idEjercicio)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idPersona INT NOT NULL,
  token CHAR(64) NOT NULL,
  tipo ENUM('verificacion', 'reset_password') NOT NULL,
  expiracion DATETIME NOT NULL,
  usado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_auth_tokens_token (token),
  KEY idx_auth_tokens_lookup (tipo, usado, expiracion),
  KEY idx_auth_tokens_persona_tipo (idPersona, tipo),
  CONSTRAINT fk_auth_tokens_persona
    FOREIGN KEY (idPersona) REFERENCES persona(idPersona)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
