-- =====================================================
-- Script: Insertar Profesor y 5 Alumnos de Prueba
-- =====================================================
-- Fecha: 2026-03-09
-- Password para todos: password123
-- Hash bcrypt: $2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.
-- =====================================================

USE `adrenalina_extrema`;

-- =====================================================
-- 1. PROFESOR (COACH)
-- =====================================================

INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'Juan Carlos Aluztiza',
  'profesor@gym.com',
  '+54 11 4567-8900',
  'coach',
  'Av. Corrientes 1234, CABA',
  '1985-03-15',
  75,
  175,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'masculino',
  'Avanzado',
  TRUE
);

-- =====================================================
-- 2. ALUMNOS
-- =====================================================

-- ALUMNO 1: Juan Pérez (Avanzado)
INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'Juan Pérez',
  'juan@mail.com',
  '+54 11 5555-1111',
  'alumno',
  'Calle Falsa 123, CABA',
  '1995-07-20',
  75,
  178,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'masculino',
  'Avanzado',
  TRUE
);

-- ALUMNO 2: María Rodríguez (Principiante)
INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'María Rodríguez',
  'maria@mail.com',
  '+54 11 5555-2222',
  'alumno',
  'Av. Rivadavia 5678, CABA',
  '2000-11-10',
  58,
  162,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'femenino',
  'Principiante',
  TRUE
);

-- ALUMNO 3: Pedro García (Intermedio)
INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'Pedro García',
  'pedro@mail.com',
  '+54 11 5555-3333',
  'alumno',
  'San Martín 999, CABA',
  '1998-03-25',
  82,
  180,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'masculino',
  'Intermedio',
  TRUE
);

-- ALUMNO 4: Ana López (Intermedio)
INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'Ana López',
  'ana@mail.com',
  '+54 11 5555-4444',
  'alumno',
  'Belgrano 777, CABA',
  '1997-09-05',
  62,
  168,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'femenino',
  'Intermedio',
  TRUE
);

-- ALUMNO 5: Carlos Fernández (Principiante)
INSERT INTO `persona` (
  `nombre`, 
  `mail`, 
  `tel`, 
  `rol`, 
  `direccion`, 
  `fechaNac`, 
  `peso`, 
  `altura`, 
  `password`,
  `activo`,
  `genero`,
  `nivel`,
  `email_verificado`
) VALUES (
  'Carlos Fernández',
  'carlos@mail.com',
  '+54 11 5555-5555',
  'alumno',
  'Callao 456, CABA',
  '2001-01-30',
  70,
  175,
  '$2b$10$9JEcVr1f5TaFl0D4pgwRpeVgMJIZiVPDBDRSSuoHqGVQ7GQW61eM.',
  TRUE,
  'masculino',
  'Principiante',
  TRUE
);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT '✅ Insertados exitosamente: 1 profesor (coach) y 5 alumnos' AS mensaje;

SELECT 
  idPersona, 
  nombre, 
  mail, 
  rol, 
  nivel,
  genero,
  activo,
  email_verificado
FROM persona 
WHERE mail IN (
  'profesor@gym.com',
  'juan@mail.com',
  'maria@mail.com',
  'pedro@mail.com',
  'ana@mail.com',
  'carlos@mail.com'
)
ORDER BY rol DESC, nombre;

-- =====================================================
-- CREDENCIALES DE ACCESO
-- =====================================================
-- 
-- PROFESOR:
--   Email: profesor@gym.com
--   Password: password123
-- 
-- ALUMNOS:
--   juan@mail.com     | password123 | Avanzado
--   maria@mail.com    | password123 | Principiante
--   pedro@mail.com    | password123 | Intermedio
--   ana@mail.com      | password123 | Intermedio
--   carlos@mail.com   | password123 | Principiante
-- 
-- =====================================================
