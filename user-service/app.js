const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes')
const SubscriptionPaymentController = require('./controllers/SubscriptionPaymentController');

const app = express();

app.post(
    "/api/payments/webhooks/stripe",
    express.raw({ type: 'application/json' }),
    SubscriptionPaymentController.stripeWebhook
)

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())

// Rutas del API
app.use('/api', routes);

// Ruta raiz
app.use('/', (req, res) => {
    res.status(200).json({ message: 'API levantada con exito!' });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
})

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
})

module.exports = app;