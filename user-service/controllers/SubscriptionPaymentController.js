const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { SubscriptionPayment, Subscription, User } = require("../models");
const PRICES = require("../pricing");

// Obtener pagos de una suscripción
exports.getPaymentsBySubscription = async (req, res) => {
  const { subscription_id } = req.params;
  try {
    const pagos = await SubscriptionPayment.getBySubscription(subscription_id);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar pago
exports.createPayment = async (req, res) => {
  const { subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id } = req.body;
  try {
    const paymentId = await SubscriptionPayment.create(subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id);
    
    if (status === "APPROVED") {
      await Subscription.activate(subscription_id);
    }
    
    res.status(201).json({ message: "Pago registrado", id: paymentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStripeIntent = async (req, res) => {
  try {
    const { userId, plan_code, payment_method_id, idempotency_key } = req.body || {};
    if (!userId || !plan_code || !payment_method_id) {
      return res.status(400).json({ message: 'userId, plan_code y payment_method_id son requeridos' });
    }
    const price = PRICES[plan_code];
    if (!price) return res.status(400).json({ message: 'plan_code inválido' });

    // “Reservar” suscripción en PENDING con tus fechas:
    const subscription_id = await Subscription.create(
      userId,
      plan_code,
      new Date(),
      null,
      'PENDING'
    );

    // Crear + confirmar Intent (sin redirecciones)
    const intent = await stripe.paymentIntents.create({
      amount: price.amount,               // cents
      currency: price.currency,
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: {
        user_id: String(userId),
        subscription_id: String(subscription_id),
        plan_code
      }
    }, idempotency_key ? { idempotencyKey: idempotency_key } : undefined);

    // Si ya quedó pagado, registra de una vez (igual lo hará el webhook)
    if (intent.status === 'succeeded') {
      const amountUnits = (intent.amount_received ?? intent.amount) / 100;
      try {
        await SubscriptionPayment.create(
          subscription_id,
          amountUnits,
          (intent.currency || 'GTQ').toUpperCase(),
          'STRIPE',
          intent.id,
          'APPROVED',
          new Date(),
          null,
          null
        );
      } catch (_) { /* idempotencia por uq_provider_ref */ }
    }

    return res.json({
      status: intent.status,
      client_secret: intent.client_secret,
      requires_action: intent.status === 'requires_action'
    });
  } catch (err) {
    return res.status(400).json({ message: err?.message || 'Error al crear PaymentIntent' });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body!
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Firma inválida: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const subId = Number(pi.metadata?.subscription_id);
      if (subId) {
        const amountUnits = (pi.amount_received ?? pi.amount) / 100;
        await SubscriptionPayment.create(
          subId,
          amountUnits,
          (pi.currency || 'GTQ').toUpperCase(),
          'STRIPE',
          pi.id,
          'APPROVED',
          new Date(),
          null,
          null
        );
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const subId = Number(pi.metadata?.subscription_id);
      if (subId) {
        await SubscriptionPayment.create(
          subId,
          (pi.amount ?? 0) / 100,
          (pi.currency || 'GTQ').toUpperCase(),
          'STRIPE',
          pi.id,
          'FAILED',
          null,
          pi.last_payment_error?.message || 'payment_failed',
          null
        );
      }
    }
    return res.json({ received: true });
  } catch (err) {
    // Puedes devolver 500 para que Stripe reintente el webhook
    console.error('Error manejando webhook:', err);
    return res.status(200).json({ received: true, note: 'handled with errors' });
  }
};