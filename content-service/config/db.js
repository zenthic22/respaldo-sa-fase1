const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contentdb';

mongoose.set('strictQuery', true);

async function connectMongo() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("[mongo] conectado a: ", MONGO_URI);
    } catch (error) {
        console.error("[mongo] error de conexion: ", error.message);
        process.exit(1);
    }
}

connectMongo();

mongoose.connection.on('disconnected', () => {
    console.warn("[mongo] desconectado");
});

module.exports = mongoose;