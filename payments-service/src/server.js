import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import mongoose from 'mongoose';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // sk_test_...
const PUBLISHABLE_KEY  = process.env.STRIPE_PUBLISHABLE_KEY; // pk_test_...
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contentdb';
const stripe = new Stripe(STRIPE_SECRET_KEY);
await mongoose.connect(MONGO_URI);

const subSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  plan: { type: String, default: 'FREE' },
  updated_at: { type: Date, default: Date.now }
});
const Subscription = mongoose.model('Subscription', subSchema);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// estado de suscripción
app.get('/subscriptions/:userId', async (req, res) => {
  const s = await Subscription.findOne({ user_id: req.params.userId }).lean();
  res.json({ user_id: req.params.userId, plan: s?.plan || 'FREE' });
});

// crear pago (PaymentIntent) y confirmar
app.post('/payments/create', async (req, res) => {
  const { userId, payment_method_id } = req.body || {};
  if (!userId || !payment_method_id) return res.status(400).json({ message: 'userId y payment_method_id requeridos' });

  // monto fijo demo: $9.99
  const amount = 999; // cents
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method: payment_method_id,
    confirm: true,
    // 👇 clave: permite automáticos pero prohíbe redirecciones
    automatic_payment_methods: { enabled: true, allow_redirects: 'never' }
  });



  
  if (intent.status === 'succeeded') {
    await Subscription.updateOne(
      { user_id: userId },
      { $set: { plan: 'PREMIUM', updated_at: new Date() } },
      { upsert: true }
    );
  }

  res.json({ status: intent.status, client_secret: intent.client_secret });
});

// para el frontend: clave pública
app.get('/config/stripe', (_, res) => {
  res.json({ publishableKey: PUBLISHABLE_KEY });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Payments Service on :${PORT}`));
