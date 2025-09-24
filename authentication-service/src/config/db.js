// src/config/db.js

import mysql from 'mysql2/promise';
import 'dotenv/config';

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0
  });

  pool.query('SELECT 1')
    .then(() => console.log('Conexión a la base de datos establecida.'))
    .catch((err) => console.error('Error al hacer la consulta de prueba:', err));

} catch (error) {
    console.error('No se pudo crear el pool de conexiones a la base de datos:', error);
}


export default pool;