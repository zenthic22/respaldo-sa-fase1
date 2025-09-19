const app = require('./app');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config()

const PORT = process.env.PORT || 3001;

db.getConnection()
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server levantado en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Fallo en la conexion a la base de datos: ', error);
    });