# Adrenalina Extrema - Coach Dashboard MVP

Dashboard mobile-first para gestión de alumnos y rutinas de running/entrenamiento.

## 🚀 Características

- **Mobile-First Design**: Optimizado para uso en pista con botones grandes y alto contraste
- **Navegación Adaptable**: BottomNavbar para móvil, Sidebar para desktop
- **Gestión de Alumnos**: Buscador, filtros por nivel, vista detallada con gráfico de progreso
- **Constructor de Rutinas**: Formulario dinámico para crear rutinas con ejercicios estructurados
- **Sistema de Rutinas**: Basado en `ExerciseInstance` con `exerciseId`, `name`, `type` (reps/segundos), `value` y `sets`
- **UX Mejorada**: Skeleton loaders, transiciones suaves, feedback visual con hover/active

## 🛠️ Stack Tecnológico

- **React 19** + **Vite 7**
- **Tailwind CSS v4** (con @tailwindcss/postcss)
- **Lucide React** para iconos
- **Recharts** para gráficos de progreso
- **Context API** para estado global

## 📦 Instalación

Las dependencias ya están instaladas. Si necesitas reinstalar:

```bash
npm install
```

**Nota**: Este proyecto usa Tailwind CSS v4 con el nuevo plugin PostCSS. No se requiere `tailwind.config.js`.

## 🔥 Ejecución

### Modo desarrollo
```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## 📱 Vistas Implementadas

### 1. StudentList
- Buscador en tiempo real
- Filtro por nivel (Principiante, Intermedio, Avanzado)
- Cards con información del alumno
- Navegación a detalle con skeleton loader

### 2. StudentDetail
- Perfil del alumno con foto y nivel
- Gráfico de progreso (últimas 5 sesiones)
- Estadísticas: último rendimiento, promedio, rutinas completadas
- Historial de rutinas asignadas

### 3. RoutineBuilder
- Formulario para nombre de rutina
- Selector dinámico de ejercicios
- Configuración de cada ejercicio:
  - Tipo: reps o segundos
  - Valor numérico
  - Número de sets
- Validación y guardado

### 4. Profile
- Vista de perfil del coach (placeholder)

## 🎨 Diseño

- **Colores principales**: 
  - Primary: `#FF5722` (naranja)
  - Secondary: `#2196F3` (azul)
- **Botones**: Estados hover, active:scale-95
- **Transiciones**: Suaves en todas las interacciones
- **Responsive**: Breakpoints md: para desktop

## 📊 Mock Data

### Alumnos (5)
- Juan Pérez (Avanzado)
- María López (Intermedio)
- Carlos Ruiz (Principiante)
- Ana García (Avanzado)
- Luis Fernández (Intermedio)

### Ejercicios (10)
- Burpees, Estocadas, Trote Suave, Sprint 100m, Mountain Climbers
- Plancha, Jumping Jacks, Sentadillas, Desplazamientos Laterales, Skipping Alto

## 🧩 Estructura del Proyecto

```
src/
├── components/
│   ├── BottomNavbar.jsx
│   ├── Sidebar.jsx
│   └── SkeletonLoader.jsx
├── views/
│   ├── StudentList.jsx
│   ├── StudentDetail.jsx
│   ├── RoutineBuilder.jsx
│   └── Profile.jsx
├── context/
│   └── AppContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 📝 Notas

- Usuario simulado: `userRole: 'coach'`
- Estado global con Context API
- Renderizado condicional para navegación entre vistas
- Componentes atómicos y reutilizables
