import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import { authenticateToken } from './src/middleware/auth.middleware.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
   origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}))

// --- Definición de Rutas y Redirecciones ---

// 1. Rutas públicas al servicio de autenticación (sin validación de token)
app.use('/backend/auth-service', proxy(process.env.AUTH_SERVICE_URL));

// 2. Rutas protegidas al servicio de usuarios
// Se ejecuta primero el middleware 'authenticateToken'. Si pasa, se redirige.
app.use('/backend/user-service', proxy(process.env.USER_SERVICE_URL));

app.use('/backend/content-service', proxy(process.env.CONTENT_SERVICE_URL));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en el puerto ${PORT}`);
});