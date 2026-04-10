# Adrenalina Extrema - Backend

Backend API para el sistema de gestión de entrenamiento Adrenalina Extrema.

## Tecnologías

- **Node.js** + **Express** - Servidor API REST
- **MySQL** - Base de datos relacional
- **mysql2** - Driver MySQL con soporte para promesas

## Estructura del Proyecto

```
backend/
├── server.js           # Punto de entrada del servidor
├── package.json        # Dependencias del proyecto
├── schema.sql         # Esquema de la base de datos MySQL
├── .env.example        # Variables de entorno (template)
├── .gitignore         # Archivos ignorados por git
├── config/            # Configuración (DB, etc)
│   └── database.js    # Pool de conexiones MySQL
├── controllers/       # Lógica de negocio
├── models/           # Modelos de datos
├── routes/           # Rutas de la API
├── middleware/       # Middleware personalizado
└── utils/            # Funciones utilitarias
```

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configura las variables de entorno en `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=adrenalina_extrema
   DB_USER=root
   DB_PASSWORD=tu_password
   ```

3. Crea la base de datos MySQL:
   ```bash
   mysql -u root -p < schema.sql
   ```

## Uso

Desarrollo (con auto-reload):
```bash
npm run dev
```

Producción:
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000` y probará automáticamente la conexión a MySQL.

## 📂 Estructura de Archivos

```
backend/
├── server.js                 # Servidor Express principal
├── package.json             # Dependencias
├── adrenalina_extrema.sql   # Schema de base de datos
├── API_DOCS.md             # Documentación completa de API
├── .env.example            # Variables de entorno
│
├── config/
│   └── database.js         # Pool de conexiones MySQL
│
├── models/                 # Modelos de datos
│   ├── Persona.js
│   ├── Ejercicio.js
│   ├── TipoEjercicio.js
│   └── Rutina.js
│
├── controllers/            # Lógica de negocio
│   ├── personaController.js
│   ├── ejercicioController.js
│   ├── tipoEjercicioController.js
│   └── rutinaController.js
│
├── routes/                # Rutas de API
│   ├── personas.js
│   ├── ejercicios.js
│   ├── tiposEjercicio.js
│   └── rutinas.js
│
├── middleware/            # Middleware personalizado
│   ├── validation.js      # Validaciones
│   └── common.js         # Utilidades comunes
│
└── utils/                # Funciones utilitarias
    └── helpers.js        # Helpers generales
```

## 🗄️ Modelo de Base de Datos

### Tablas principales:
- **persona** - Usuarios (alumnos y entrenadores)
- **ejercicio** - Catálogo de ejercicios
- **tipo_ejercicio** - Categorías de ejercicios
- **rutina** - Rutinas de entrenamiento
- **rutina_ejercicio** - Relación N:M entre rutinas y ejercicios
- **alumno_rutina** - Asignación de rutinas a alumnos

## 🔌 API Endpoints

Ver la documentación completa en [API_DOCS.md](API_DOCS.md)

### Recursos principales:
- **`/api/personas`** - Gestión de usuarios (alumnos/entrenadores)
- **`/api/ejercicios`** - Catálogo de ejercicios
- **`/api/rutinas`** - Gestión de rutinas
- **`/api/tipos-ejercicio`** - Categorías de ejercicios

Cada recurso soporta operaciones CRUD completas (GET, POST, PUT, DELETE).

## 🧪 Testing

### Test de conexión
El servidor prueba automáticamente la conexión MySQL al iniciar:
```bash
npm run dev
```

### Test manual de endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Listar personas
curl http://localhost:3000/api/personas

# Crear persona (ejemplo)
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{"idPersona":1,"nombre":"Test User","password":"123456"}'
```

## 🚀 Próximos pasos

1. **Autenticación**: Implementar JWT para autenticación de usuarios
2. **Validaciones**: Agregar validaciones más robustas
3. **Testing**: Agregar tests unitarios e integración
4. **Documentación**: Swagger/OpenAPI para documentación interactiva
