// app.js
const express = require('express');
const cors = require('cors');

require('./config/db'); // esto ejecuta la conexión de Mongoose

const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Con Express 4.16+ no necesitas body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas del API
app.use('/api', routes);

// Ruta raíz
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'API levantada con exito!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Errores
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;