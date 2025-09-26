// server.js
require('dotenv').config();
const app = require('./app');
const mongoose = require('./config/db'); // este archivo ya hace mongoose.connect(...)

const PORT = process.env.PORT || 3002;

mongoose.connection.once('open', () => {
  console.log('MongoDB conectado');
  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
  process.exit(1);
});

// Shutdown limpio
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB desconectado por SIGINT');
  process.exit(0);
});