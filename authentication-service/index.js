// index.js

// 1. Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js'; // 👈 1. Importa las rutas
import errorHandler from './src/utils/errorHandler.js'; // 👈 1. Importa el handler

// 2. Configuraciones iniciales
dotenv.config(); // Carga las variables de entorno del archivo .env

const app = express();
const PORT = process.env.PORT || 4001;

// 3. Middlewares
app.use(express.json()); // Para poder entender los JSON que lleguen en el body
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use('/api/auth', authRoutes);

// 4. Rutas (por ahora, una de prueba)
app.get('/', (req, res) => {
  res.send('✅ Authentication Service está funcionando!');
});



app.use(errorHandler);

// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Authentication Service escuchando en el puerto ${PORT}`);
});