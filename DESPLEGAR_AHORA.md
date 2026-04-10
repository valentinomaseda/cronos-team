# 🚨 GUÍA DE DESPLIEGUE URGENTE - Fix Ejercicios Duplicados

## ❌ Problemas que se están solucionando:

1. ✅ Ejercicios repetidos se actualizan todos juntos (mismo feedback en todos)
2. ✅ Al refrescar, se pierde el estado de completado y el feedback
3. ✅ La rutina completa se marca como completada incorrectamente

---

## 📋 PASOS A SEGUIR (EN ORDEN)

### ⏰ PASO 1: Ejecutar Migración Principal (si no lo hiciste)

**Archivo**: `backend/migracion_cantidad_decimal.sql`  
**Dónde**: Railway MySQL Workbench

```sql
USE railway;

ALTER TABLE rutina_ejercicio 
MODIFY COLUMN cantidad DECIMAL(10, 2) NOT NULL DEFAULT 10.00;

ALTER TABLE alumno_rutina_ejercicio 
MODIFY COLUMN cantidad DECIMAL(10, 2) NOT NULL DEFAULT 10.00;

ALTER TABLE alumno_rutina_ejercicio
ADD COLUMN ejercicioCompletado BOOLEAN DEFAULT FALSE;

ALTER TABLE alumno_rutina_ejercicio
ADD COLUMN feedbackAlumno TEXT DEFAULT NULL;
```

✅ **Resultado esperado**: Columnas agregadas exitosamente

---

### 🚨 PASO 2: URGENTE - Asignar orden único a ejercicios

**Archivo**: `backend/URGENTE_fix_orden.sql`  
**Dónde**: Railway MySQL Workbench  
**Por qué es crítico**: Sin esto, actualizar un ejercicio actualiza todos los repetidos

**Copiar y ejecutar TODO el contenido del archivo**, que incluye:
1. Diagnóstico del problema
2. Copia de orden desde rutina_ejercicio
3. Asignación secuencial para ejercicios sin orden
4. Verificación final (debe retornar 0 ejercicios sin orden)

✅ **Resultado esperado**: Mensaje "✅ SOLUCIONADO - Todos los ejercicios tienen orden"

---

### 📤 PASO 3: Desplegar Nuevo Frontend

**Archivos modificados**:
- `frontend/dist/` - Nueva compilación con archivo `index-Btl3O0yh.js`

**Cambios incluidos**:
- Mapea correctamente `ejercicioCompletado`, `feedbackAlumno` y `orden`
- Envía `orden=null` al backend cuando no existe (en lugar de `orden=0`)

**Acción**: Subir todo el contenido de `frontend/dist/` a tu servidor de producción

---

### 🔄 PASO 4: Reiniciar Backend (Railway)

Railway detecta automáticamente cambios en Git. Si ya hiciste commit de:
- `backend/models/Rutina.js` (con validación de affectedRows)
- `backend/routes/rutinas.js` (con requireCoachOrSelf)

El backend se reiniciará automáticamente.

---

## ✅ VERIFICACIÓN POST-DESPLIEGUE

1. **Limpiar caché del navegador**: Ctrl+F5
2. **Login como alumno**
3. **Abrir una rutina asignada**
4. **Marcar UN ejercicio como completado**
5. **Escribir feedback en ESE ejercicio**
6. **Click "Guardar cambios"**
7. **✅ Debe guardar exitosamente**
8. **Refrescar navegador (F5)**
9. **✅ El ejercicio debe seguir marcado como completado**
10. **✅ El feedback debe aparecer en el textarea**
11. **✅ SOLO ese ejercicio debe estar marcado (no todos)**

### Si ves este error en logs de Railway:
```
🚨 [updateAlumnoEjercicio] ¡Se actualizaron 3 ejercicios a la vez!
```
**Significa**: No ejecutaste el PASO 2 (URGENTE_fix_orden.sql)  
**Solución**: Ejecutar ese script AHORA

---

## 📊 Verificación en Base de Datos

Después del PASO 2, ejecuta esto para verificar:

```sql
USE railway;

-- Debe retornar 0
SELECT COUNT(*) as ejercicios_sin_orden 
FROM alumno_rutina_ejercicio 
WHERE orden IS NULL;

-- Ver ejemplos de ejercicios con orden asignado
SELECT 
  p.nombre as Alumno,
  e.nombre as Ejercicio,
  are.orden,
  are.ejercicioCompletado,
  are.feedbackAlumno
FROM alumno_rutina_ejercicio are
JOIN persona p ON are.idPersona = p.idPersona  
JOIN ejercicio e ON are.idEjercicio = e.idEjercicio
ORDER BY p.nombre, are.orden
LIMIT 10;
```

---

## 🆘 TROUBLESHOOTING

### Problema: "Ejercicio no encontrado para este alumno" (404)
**Causa**: Frontend viejo en caché  
**Solución**: Ctrl+F5 para limpiar caché

### Problema: Todos los ejercicios se marcan juntos
**Causa**: Falta ejecutar URGENTE_fix_orden.sql  
**Solución**: Ejecutar PASO 2 AHORA

### Problema: Al refrescar se pierde el estado
**Causa**: Frontend viejo sin los campos mapeados  
**Solución**: Desplegar nuevo frontend (PASO 3)

---

## 📁 ARCHIVOS MODIFICADOS

### Backend:
- ✅ `models/Rutina.js` - Validación de affectedRows
- ✅ `routes/rutinas.js` - requireCoachOrSelf en PUT
- 📄 `URGENTE_fix_orden.sql` - EJECUTAR AHORA

### Frontend:
- ✅ `context/AppContext.jsx` - Mapea campos de seguimiento
- ✅ `views/StudentRoutines.jsx` - Envía orden=null correctamente
- 📤 `dist/` - DESPLEGAR NUEVA COMPILACIÓN

---

## ⏱️ TIEMPO ESTIMADO

- Paso 1 (Migración): 30 segundos
- Paso 2 (Fix orden): 1 minuto
- Paso 3 (Deploy frontend): 2-5 minutos
- Paso 4 (Backend restart): Automático
- **Total: ~10 minutos**
