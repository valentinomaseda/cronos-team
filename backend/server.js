import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { testConnection } from './config/database.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API Adrenalina Extrema funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Importar rutas
import personasRoutes from './routes/personas.js';
import ejerciciosRoutes from './routes/ejercicios.js';
import rutinasRoutes from './routes/rutinas.js';
import tiposEjercicioRoutes from './routes/tiposEjercicio.js';
import profesoraRoutes from './routes/profesora.js';
import authRoutes from './routes/auth.js';

// Usar rutas
app.use('/api/personas', personasRoutes);
app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/rutinas', rutinasRoutes);
app.use('/api/tipos-ejercicio', tiposEjercicioRoutes);
app.use('/api/profesora', profesoraRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});
