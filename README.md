# Adrenalina Extrema

Sistema de gestión de entrenamiento personalizado.

## Estructura del Proyecto

```
adrenalina-extrema/
├── frontend/          # Aplicación React (Vite)
│   ├── src/
│   ├── index.html
│   └── package.json
│
└── backend/           # API REST (Express)
    ├── server.js
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── package.json
```

## Inicio Rápido

### Backend
```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copia .env.example a .env y configura tu base de datos MySQL
cp .env.example .env

# Importar schema de base de datos
mysql -u root -p < adrenalina_extrema.sql

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Documentación

- Ver [frontend/README.md](frontend/README.md) para documentación del frontend
- Ver [backend/README.md](backend/README.md) para documentación del backend
