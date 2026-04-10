# 🚀 Quick Start Guide

## ⚡ Inicio Rápido (5 segundos)

El servidor ya está corriendo en:
```
http://localhost:5174/
```

Abre tu navegador y accede a esa URL.

---

## 🔧 Si necesitas reiniciar el servidor

### Windows PowerShell

```powershell
# Habilitar ejecución de scripts (necesario en Windows)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Iniciar servidor de desarrollo
npm run dev
```

### CMD / Bash / macOS / Linux

```bash
npm run dev
```

El servidor se iniciará automáticamente en `http://localhost:5173` (o el siguiente puerto disponible).

---

## 📱 Prueba el Dashboard

### En Mobile (Responsive)
1. Abre las DevTools de tu navegador (F12)
2. Activa el modo de dispositivo móvil (Toggle device toolbar)
3. Selecciona un dispositivo (ej. iPhone 12)
4. Verás la **BottomNavbar** en la parte inferior

### En Desktop
1. Abre en ventana completa
2. Verás la **Sidebar** lateral izquierda
3. Las cards se organizan en grid de 3 columnas

---

## 🎯 Flujo de Prueba Sugerido

### 1. Explorar StudentList
- ✅ Busca "Juan" en el buscador
- ✅ Filtra por nivel "Avanzado"
- ✅ Click en una card para ver detalle

### 2. Ver StudentDetail
- ✅ Observa el gráfico de progreso (Recharts)
- ✅ Revisa las estadísticas (último rendimiento, promedio)
- ✅ Verifica el historial de rutinas
- ✅ Click en "← Atrás" para volver

### 3. Crear Rutina (RoutineBuilder)
- ✅ Navega a "Rutinas" desde la navegación
- ✅ Ingresa nombre: "Mi Primera Rutina"
- ✅ Click en "➕ Agregar"
- ✅ Selecciona ejercicio: "Burpees"
- ✅ Configura: Tipo=Reps, Valor=20, Sets=4
- ✅ Agrega otro ejercicio (ej. Plancha, 60 seg, 3 sets)
- ✅ Click en "💾 Guardar Rutina"
- ✅ Verás feedback verde de éxito
- ✅ Abre la consola (F12) para ver el objeto guardado

### 4. Ver Perfil
- ✅ Navega a "Perfil"
- ✅ Verifica info del coach

---

## 🎨 Prueba Estados Interactivos

### Hover en botones
- Mueve el mouse sobre cualquier botón
- Verás: cambio de color + escala 105%

### Click en botones
- Haz click y mantén presionado
- Verás: escala 95% (feedback táctil)

### Skeleton Loaders
- Click en un alumno en StudentList
- Verás animación de carga por 300ms

---

## 📊 Mock Data Incluido

### Alumnos (5)
1. **Juan Pérez** - Avanzado (2 rutinas)
2. **María López** - Intermedio (1 rutina)
3. **Carlos Ruiz** - Principiante (0 rutinas)
4. **Ana García** - Avanzado (1 rutina)
5. **Luis Fernández** - Intermedio (2 rutinas)

### Ejercicios (10)
Burpees, Estocadas, Trote Suave, Sprint 100m, Mountain Climbers,
Plancha, Jumping Jacks, Sentadillas, Desplazamientos Laterales, Skipping Alto

---

## 🛠️ Build de Producción

Para generar una versión optimizada:

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

Para previsualizar el build:

```bash
npm run preview
```

---

## 📚 Documentación Adicional

- **README.md**: Documentación general del proyecto
- **FEATURES.md**: Características detalladas de cada vista
- **STRUCTURE.md**: Estructura de archivos y carpetas
- **EXERCISE_STRUCTURE.js**: Ejemplo de estructura de datos
- **CHECKLIST.md**: Checklist completo de especificaciones
- **MOCKUP.md**: Mockups visuales ASCII del dashboard

---

## 🐛 Troubleshooting

### El servidor no inicia
```powershell
# Windows: Habilita ejecución de scripts
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

### Puerto ocupado
Vite automáticamente buscará el siguiente puerto disponible.
Si 5173 está ocupado, usará 5174, 5175, etc.

### Errores de build
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Gráficos no se muestran
Verifica que `recharts` esté instalado:
```bash
npm list recharts
```

---

## 🎉 ¡Listo para usar!

El MVP está completamente funcional y listo para uso en:
- 📱 Mobile (uso en pista)
- 💻 Desktop (planificación desde oficina)

**Disfruta explorando el Dashboard!** 🚀
